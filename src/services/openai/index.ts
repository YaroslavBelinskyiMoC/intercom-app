import OpenAI from "openai";

import { logger } from "../../logger";
import { cfg } from "../../config/env";
import article from "../../dataFiles/mock_article";

const log = logger(__filename);

const openai = new OpenAI({
  apiKey: cfg.OPENAI_API_KEY,
});

const contextText = article[0].pageContent;

// Special prompt for OpenAI
const systemMessage = `
You are an AI assistant. You will answer questions based on the following context that contains HTML tags:
${contextText}
You need to get text and links from the context according to HTML tags, parse them one by one in order how you find them in text and add them into the following format:
"text": 'text you found', "imageLink": 'image link you found', "videoLink": 'video link you found', "siteLink": 'site link you found'. 
Example how it must look:
[ "text": "text that you found in the context", "imageLink": "image that was right after the text that you found previously", "text": "the next text after the link", "siteLink": "link after the previous text", ...]
`;

// Function to get the answer from OpenAI
async function getFormattedAnswer(param) {
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
      temperature: 0.2,
      model: "gpt-4",
    });
    log.info(answer);
  } catch (error) {
    log.error("Error:", error);
  }
}

export default getFormattedAnswer;
