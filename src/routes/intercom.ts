import { Router, Request, Response } from "express";
import {
  initialCanvas, endingCanvas, userQuestionGenerator
} from "../components";
import { logger } from "../logger";
import { dbClient } from "../services/db";

const log = logger(__filename);

const router: Router = Router();

router.post("/initialize", (request: Request, response: Response) => {
  try {
    log.info("App initialization");
    response.send(initialCanvas);
  } catch (error) {
    log.info(error);
    response.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/submit", async (request: Request, response: Response) => {
  try {
    log.info("Submit clicked");
    if (request.body.component_id == "submit-issue-form") {
      const userQuestion = request.body.input_values.description;
      const gptAnswer = await dbClient.search(request.body.userQuestion);
      log.info("user question:", request.body.input_values);
      log.info(gptAnswer)
      log.info(request.body.current_canvas.content.components);
      const canvasAnswer = {
        canvas: {
          content: request.body.current_canvas.content,
        },
      };
      const array = canvasAnswer.canvas.content.components;
      
      const newComponents = additionalAnswerGenerator(input);
      array.splice(array.length - 12, 0, ...newComponents);
      response.send(canvasAnswer);
    } else {
      response.send(initialCanvas);
    }
  } catch (error) {
    log.info(error);
    response.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
