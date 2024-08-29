import { Request, Response } from "express";
import { dbClient } from "../services/db";
import { updatedArticles } from "./../services/articles";
import { logger } from "../logger";
const log = logger(__filename);

async function setProducts(request: Request, response: Response) {
  try {
    await updatedArticles();
    log.info("Articles updated");
    response.send({ status: "ok" });
  } catch (error) {
    log.info(error);
    response.status(500).send({ error: "Internal Server Error" });
  }
}

async function searchProducts(request: Request, response: Response) {
  try {
    const query: any = request.query;
    const result = await dbClient.search(query.param);
    // log.info(`Article found: ${result}`);
    response.send(result);
  } catch (error) {
    log.info(error);
    response.status(500).send({ error: "Internal Server Error" });
  }
}

export { setProducts, searchProducts };
