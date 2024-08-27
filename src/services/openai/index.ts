import OpenAI from 'openai';

import { logger } from '../../logger';
import { cfg } from '../../config/env';
import article from '../../dataFiles/mock_article'

const log = logger(__filename);

const openai = new OpenAI({
    apiKey: cfg.OPENAI_API_KEY,
});

const contextText = article[0].pageContent;

// Special prompt for OpenAI
const systemMessage = `
You are an AI assistant. You will answer questions based on the following text. Provide the answer in the following format:

{
  text: '',
  image: '',
  video: '',
}

Make sure to include any image or video links in the text and put them in the appropriate fields one by one in the correct order.

Context:
${contextText}
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
            model: 'gpt-4',
        });
        log.info(answer);
    } catch (error) {
        log.error("Error:", error);
    }
}

export default getFormattedAnswer;
