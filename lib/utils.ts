import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import endent from "endent";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

const createEmailPrompt = (emailRequirements: string) => {
  return endent`
    You are an AI trained to create professional HTML-formatted emails. Given the following requirements, generate an email that fulfills them in HTML format:

    Dont Return <!DOCTYPE html> tag. Remember to add double <br /> tags.
    Requirements:
    ${emailRequirements}

    HTML email:
  `;
};

export const OpenAIStream = async (
  emailRequirements: string,
  model: string,
  apiKey: string
) => {
  const prompt = createEmailPrompt(emailRequirements);

  const system = { role: "system", content: prompt };

  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey || process.env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      model,
      messages: [system],
      temperature: 0,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        result ? decoder.decode(result.value) : statusText
      }`
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
