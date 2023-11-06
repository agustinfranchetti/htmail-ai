import { TranslateBody } from "@/types/types";
import { OpenAIStream } from "@/lib/utils";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { emailRequirements, model, apiKey } =
      (await req.json()) as TranslateBody;

    const stream = await OpenAIStream(emailRequirements, model, apiKey);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
