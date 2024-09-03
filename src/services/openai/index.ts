import OpenAI from "openai";

import { logger } from "../../logger";
import { cfg } from "../../config/env";

const log = logger(__filename);

const openai = new OpenAI({
  apiKey: cfg.OPENAI_API_KEY,
});

// Function to get the answer from OpenAI
async function getFormattedAnswer(param, context) {
  // Special prompt for OpenAI
  const systemMessage = `
  You are an assistant for Zipify documentation question-answering tasks.
  Use the following HTML pieces of retrieved context to answer the question. In these pieces you can find images and other links.
  You have to show links, images in your answer, if you got them in retrieved context.
  Your generated text and links from the context should be added into the following format:
  Example how it MUST look:
  [ {"text": "text you generated answer"}, {"imageLink": "image link you found"}, {"siteLink": "site url you found"}, {"imageLink": "image link you found"}, ...]
  If you don't retrieved context - write 'None'.
  If you don't have relevant answer in retrieved context - write 'None'
  You have not to use information from anything other than the retrieved context.
  Retrieved context: ${context[0].pageContent}`;
  try {
    const answer = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: param,
        },
      ],
      temperature: 0,
      model: "gpt-4o",
    });
    let textAnswer = answer?.choices[0]?.message?.content;

    if (textAnswer !== undefined || textAnswer !== null) {
      textAnswer = JSON.parse(textAnswer as string);
      console.log(textAnswer);
    }
    return textAnswer;
  } catch (error) {
    log.error("Error:", error);
  }
}

export default getFormattedAnswer;
