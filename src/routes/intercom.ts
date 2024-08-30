import { Router, Request, Response } from "express";
import {
  initialCanvas,
  endingCanvas,
  userQuestionGenerator,
  mapGptAnswerToCanvas,
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
    if (request.body.component_id == "submit-new-issue") {
      const userQuestion = request.body.input_values.your_request;
      const gptAnswer = await dbClient.search(userQuestion);

      log.info(`user question: ${userQuestion}`);
      console.log(gptAnswer);
      log.info(request.body.current_canvas.content.components);

      if (gptAnswer !== null || gptAnswer !== undefined) {
        const newCanvas = mapGptAnswerToCanvas(gptAnswer);

        const userQuestionCanvas = userQuestionGenerator(userQuestion);

        newCanvas.shift(userQuestionCanvas);
        newCanvas.push(endingCanvas);
        response.send(newCanvas);
      }
    } else if (request.body.component_id == "submit-another-issue") {
      const userQuestion = request.body.input_values.description;
      const gptAnswer = await dbClient.search(request.body.userQuestion);

      log.info("user question:", request.body.input_values);
      log.info(gptAnswer);
      log.info(request.body.current_canvas.content.components);

      const newCanvas = mapGptAnswerToCanvas(gptAnswer);
      const userQuestionCanvas = userQuestionGenerator(userQuestion);

      const canvasAnswer = request.body.current_canvas.content.components; // old components
      newCanvas.shift(userQuestionCanvas);
      canvasAnswer.splice(canvasAnswer.length - 7, 0, ...newCanvas);
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
