import { DataSource, QueryRunner } from "typeorm";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TypeORMVectorStore } from "@langchain/community/vectorstores/typeorm";
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
            await Promise.all(
                productsJson.map(async (product) => {
                    await typeormVectorStore.addDocuments([product]);
                })
            );
            log.info("Upload DONE");
        } catch (err) {
            log.error(err.message);
        }
    }

    public async search(param: string): Promise<any[]> {
        try {
            const embeddings = new OpenAIEmbeddings({
                apiKey: cfg.OPENAI_API_KEY,
                batchSize: 512, // Default value if omitted is 512. Max is 2048
                model: "text-embedding-3-large",
            });

            const typeormVectorStore = await TypeORMVectorStore.fromDataSource(
                embeddings,
                databaseConfig,
            );

            log.info("Running search");

            const results = await typeormVectorStore.similaritySearchWithScore(
                param,
                30,
            );
            log.info(results);

            await getFormattedAnswer(param);

            return results;
        } catch (err) {
            log.error(err);
            return [];
        }
    }
}
const dbClient = new DatabaseHandler();
export { dbClient };
