import { DataSource, QueryRunner } from "typeorm";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TypeORMVectorStore } from "@langchain/community/vectorstores/typeorm";
import { encoding_for_model } from "tiktoken";
import { databaseConfig } from "./config";
import { cfg } from "../../config/env";
import { logger } from "../../logger";
import getFormattedAnswer from "../openai";

const log = logger(__filename);

class DatabaseHandler {
  private async initializeDataSource(): Promise<DataSource> {
    log.info("Initializing database connection");
    const dataSource = new DataSource(databaseConfig.postgresConnectionOptions);
    return await dataSource.initialize();
  }

  private async initializeQueryRunner(): Promise<QueryRunner> {
    const dataSource = await this.initializeDataSource();
    return await dataSource.createQueryRunner();
  }

  public async uploadDocuments(productsJson: any[]): Promise<void> {
    try {
      log.info("Database connecting");
      const queryRunner = await this.initializeQueryRunner();
      log.info("Running SELECT * FROM pg_available_extensions");
      const extensionsList = await queryRunner.manager.query(
        `SELECT * FROM pg_available_extensions;`,
      );
      const vectorExtension = extensionsList.find(
        (extension: any) => extension.name === "vector",
      );
      if (!vectorExtension) {
        await queryRunner.manager.query(`CREATE EXTENSION vector;`);
      }

      await queryRunner.manager.query(`DROP TABLE IF EXISTS documents ;`);

      const embeddings = new OpenAIEmbeddings({
        apiKey: cfg.OPENAI_API_KEY,
        batchSize: 512, // Default value if omitted is 512. Max is 2048
        model: "text-embedding-ada-002",
      });

      const typeormVectorStore = await TypeORMVectorStore.fromDataSource(
        embeddings,
        databaseConfig,
      );

      await typeormVectorStore.ensureTableInDatabase();
      log.info(`productsJson length: ${productsJson.length}`);

      // Initialize the tokenizer for the model
      const tokenizer = encoding_for_model("text-embedding-ada-002");
      const MAX_TOKENS = 7500; // Maximum tokens for the "text-embedding-ada-002" model
      const textDecoder = new TextDecoder("utf-8");

      // Function to split the document into chunks if it exceeds MAX_TOKENS
      function splitIntoChunks(
        content: string,
        maxChunkSize: number,
      ): string[] {
        // Tokenize the content
        const tokens = tokenizer.encode(content);
        const chunks: string[] = [];

        let start = 0;

        while (start < tokens.length) {
          let end = start + maxChunkSize;

          if (end > tokens.length) {
            end = tokens.length;
          }

          const chunkTokens = tokens.slice(start, end);
          const decodedChunk = textDecoder.decode(
            tokenizer.decode(chunkTokens),
          );

          const cleanChunk = decodedChunk.replace(/\u0000/g, "").trim();

          chunks.push(cleanChunk);

          start = end;
        }

        return chunks;
      }

      function getTokenCount(content: string): number {
        return tokenizer.encode(content).length;
      }

      function isValidVector(vector: any): boolean {
        return (
          Array.isArray(vector) &&
          vector.length > 0 &&
          vector.every((num) => typeof num === "number")
        );
      }

      for (const product of productsJson) {
        const tokenCount = getTokenCount(product.pageContent);

        if (tokenCount > MAX_TOKENS) {
          log.warn(
            `Document with link ${product.metadata.link} exceeds the token limit (${tokenCount} tokens). Splitting into chunks.`,
          );

          const chunks = splitIntoChunks(product.pageContent, MAX_TOKENS);
          const chunkedDocuments = chunks.map((chunk, index) => ({
            pageContent: chunk,
            metadata: {
              ...product.metadata,
              chunkIndex: index,
            },
          }));

          for (const chunkedDocument of chunkedDocuments) {
            const embeddingsResult = await embeddings.embedDocuments([
              chunkedDocument.pageContent,
            ]);
            if (
              Array.isArray(embeddingsResult) &&
              embeddingsResult.length > 0
            ) {
              const vector = embeddingsResult[0];
              if (isValidVector(vector)) {
                try {
                  await typeormVectorStore.addDocuments([
                    {
                      pageContent: chunkedDocument.pageContent,
                      metadata: chunkedDocument.metadata,
                      embedding: vector as any, // Type assertion to bypass TypeScript's error
                    } as any,
                  ]); // Type assertion to bypass TypeScript's error
                } catch (error) {
                  log.error(
                    `Failed to insert vector for chunk with index ${chunkedDocument.metadata.chunkIndex}:`,
                    error,
                  );
                }
              } else {
                log.error(
                  `Malformed vector for chunk with index ${chunkedDocument.metadata.chunkIndex}:`,
                  vector,
                );
              }
            } else {
              log.error(
                `Embedding result is not valid for chunk with index ${chunkedDocument.metadata.chunkIndex}:`,
                embeddingsResult,
              );
            }
          }
        } else {
          const embeddingsResult = await embeddings.embedDocuments([
            product.pageContent,
          ]);

          if (Array.isArray(embeddingsResult) && embeddingsResult.length > 0) {
            const vector = embeddingsResult[0];
            if (isValidVector(vector)) {
              try {
                await typeormVectorStore.addDocuments([
                  {
                    pageContent: product.pageContent,
                    metadata: product.metadata,
                    embedding: vector as any,
                  } as any,
                ]);
              } catch (error) {
                log.error(
                  `Failed to insert vector for product with link ${product.metadata.link}:`,
                  error,
                );
              }
            } else {
              log.error(
                `Malformed vector for product with link ${product.metadata.link}:`,
                vector,
              );
            }
          } else {
            log.error(
              `Embedding result is not valid for product with link ${product.metadata.link}:`,
              embeddingsResult,
            );
          }
        }
      }

      // Cleanup tokenizer after use
      tokenizer.free();

      log.info("Upload DONE");
    } catch (err) {
      log.error(err.message);
    }
  }

  public async search(param: string): Promise<any> {
    try {
      const embeddings = new OpenAIEmbeddings({
        apiKey: cfg.OPENAI_API_KEY,
        batchSize: 512, // Default value if omitted is 512. Max is 2048
        model: "text-embedding-ada-002",
      });

      const typeormVectorStore = await TypeORMVectorStore.fromDataSource(
        embeddings,
        databaseConfig,
      );

      log.info("Running search");

      const results = await typeormVectorStore.similaritySearchWithScore(
        param,
        3,
      );
      // log.info(results);

      const answer = await getFormattedAnswer(param, results[0]);

      return answer;
    } catch (err) {
      log.error(err);
      return [];
    }
  }
}
const dbClient = new DatabaseHandler();
export { dbClient };
