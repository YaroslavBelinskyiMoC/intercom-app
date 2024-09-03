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
      //   const gptAnswer = [];

      console.log(`user question: ${userQuestion}`);

      if (gptAnswer !== null || gptAnswer !== undefined) {
        const newCanvas = mapGptAnswerToCanvas(gptAnswer);
        // console.log("NEW CANVAS");
        // console.log(newCanvas);
        const userQuestionCanvas = userQuestionGenerator(userQuestion);

        // newCanvas.shift(userQuestionCanvas); //  ?
        // newCanvas.concat(endingCanvas); // ?
        const combinedCanvas = [
          ...userQuestionCanvas,
          ...newCanvas,
          ...endingCanvas,
        ];

        const generatedCanvas = {
          canvas: {
            content: {
              components: combinedCanvas,
            },
          },
        };
        console.log("GENERATED CANVAS");
        console.log(generatedCanvas.canvas.content.components);
        response.send(generatedCanvas);
        // response.send(initialCanvas);
      }
    } else if (request.body.component_id == "submit-another-issue") {
      const userQuestion = request.body.input_values.description;
      const gptAnswer = await dbClient.search(userQuestion);

      log.info(`user question: ${userQuestion}`);
      log.info(request.body.current_canvas.content.components);

      if (gptAnswer !== null || gptAnswer !== undefined) {
        const newCanvas = mapGptAnswerToCanvas(gptAnswer);
        // console.log("NEW CANVAS");
        // console.log(newCanvas);
        const userQuestionCanvas = userQuestionGenerator(userQuestion);

        // newCanvas.shift(userQuestionCanvas);
        const combinedCanvas = [...userQuestionCanvas, ...newCanvas];

        const canvasAnswer = request.body.current_canvas.content.components; // old components
        canvasAnswer.splice(canvasAnswer.length - 7, 0, ...combinedCanvas);

        const generatedCanvas = {
          canvas: {
            content: {
              components: canvasAnswer,
            },
          },
        };

        console.log("GENERATED CANVAS");
        console.log(generatedCanvas);
        response.send(generatedCanvas);
      }
    } else {
      response.send(initialCanvas);
    }
  } catch (error) {
    log.info(error);
    response.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
