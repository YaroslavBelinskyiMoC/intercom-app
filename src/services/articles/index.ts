import { dbClient } from "../db";
import { logger } from "../../logger";
import articles from "../../dataFiles/output";

const log = logger(__filename);

export async function updatedArticles() {
  try {
    await dbClient.uploadDocuments(articles);
  } catch (err) {
    log.error(err);
  }
}
