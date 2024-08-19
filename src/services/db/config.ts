import { DataSourceOptions } from "typeorm";
import { cfg } from "../../config/env";

export const databaseConfig = {
  postgresConnectionOptions: {
    type: "postgres",
    host: cfg.DB_HOST,
    port: 5432,
    username: cfg.DB_USERNAME,
    password: cfg.DB_PASSWORD,
    database: cfg.DB_DATABASE,
    ssl:
      cfg.NODE_ENV === "local"
        ? false
        : {
            rejectUnauthorized: false,
          },
  } as DataSourceOptions,
};
