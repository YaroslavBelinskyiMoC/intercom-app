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
    YOU DONT need to create your own answer, you just need to format the text.
    You need to format the following context that contains HTML tags:
    ${context[0].pageContent}
    You need to get text and links from the context according to HTML tags, parse them one by one in order how you find them in text and add them into the following format:
    "text": 'text you found', "imageLink": 'image link you found', "videoLink": 'video link you found', "siteLink": 'site link you found'. 
    Example how it must look:
    [ "text": "text that you found in the context", "imageLink": "image that was right after the text that you found previously", "text": "the next text after the link", "siteLink": "link after the previous text", ...]
    `;
  //   console.log(context[0].pageContent);
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
    if (answer.choices[0].message.content !== null) {
      const parsedFormattedAnswer = JSON.parse(
        answer.choices[0].message.content,
      );
      // log.info(parsedFormattedAnswer);
      return parsedFormattedAnswer;
    } else {
      log.info("No content available to parse.");
    }
  } catch (error) {
    log.error("Error:", error);
  }
}

export default getFormattedAnswer;
