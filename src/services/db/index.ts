import { DataSource, QueryRunner } from "typeorm";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TypeORMVectorStore } from "@langchain/community/vectorstores/typeorm";
import { databaseConfig } from "./config";
import { cfg } from "../../config/env";
import { logger } from "../../logger";

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
                openAIApiKey: cfg.OPENAI_API_KEY,
            });

            const typeormVectorStore = await TypeORMVectorStore.fromDataSource(
                embeddings,
                databaseConfig,
            );

            await typeormVectorStore.ensureTableInDatabase();
            log.info(`productsJson length: ${productsJson.length}`);
            await typeormVectorStore.addDocuments(productsJson);
            log.info("Upload DONE");
        } catch (err) {
            log.error(err.message);
        }
    }

    public async search(param: string): Promise<any[]> {
        try {
            const embeddings = new OpenAIEmbeddings({
                openAIApiKey: cfg.OPENAI_API_KEY,
            });

            const typeormVectorStore = await TypeORMVectorStore.fromDataSource(
                embeddings,
                databaseConfig,
            );

            log.info("Running search");

            const products: any[] = [];

            const results = await typeormVectorStore.similaritySearchWithScore(
                param,
                30,
            );
            log.info(`FOUND ${results.length} PRODUCTS`);

            results.forEach((result) => {
                const product = result[0].metadata;
                product.score = result[1];
                products.push(product);
            });

            return products;
        } catch (err) {
            log.error(err);
            return [];
        }
    }
}
const dbClient = new DatabaseHandler();
export { dbClient };
