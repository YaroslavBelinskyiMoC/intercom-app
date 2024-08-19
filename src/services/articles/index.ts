import { dbClient } from "../db";
import { logger } from "../../logger";
import articles from "../../mock/mock_article";

const log = logger(__filename);

export async function updatedArticles() {
  try {
    await dbClient.uploadDocuments(articles);
  } catch (err) {
    log.error(err);
  }
}
