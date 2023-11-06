import { useState, useEffect } from "react";
import Head from "next/head";
import { OpenAIModel, TranslateBody } from "@/types/types";
import { APIKeyInput } from "@/components/APIKeyInput";
import { ModelSelect } from "@/components/ModelSelect";
import { TextBlock } from "@/components/TextBlock";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [emailRequirements, setEmailRequirements] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");
  const [model, setModel] = useState<OpenAIModel>("gpt-3.5-turbo");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");

  const handleTranslate = async () => {
    const maxCodeLength = model === "gpt-3.5-turbo" ? 6000 : 12000;

    if (!apiKey) {
      alert("Please enter an API key.");
      return;
    }

    if (!emailRequirements) {
      alert("Please enter some code.");
      return;
    }

    if (emailRequirements.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${emailRequirements.length} characters.`
      );
      return;
    }

    setLoading(true);
    setOutputCode("");

    const controller = new AbortController();

    const body: TranslateBody = {
      emailRequirements,
      model,
      apiKey,
    };

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert("Something went wrong.");
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert("Something went wrong.");
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    setHasFinished(true);
    copyToClipboard(code);
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);

    localStorage.setItem("apiKey", value);
  };

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");

    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  return (
    <>
      <Head>
        <title>HtMail</title>
        <meta
          name="description"
          content="Generate emails effortlessly with AI."
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-100dvh p-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-gradient from-pink-500 via-purple-500 to-indigo-500 bg-clip-text dark:text-zinc-50">
                {`
                        <Htm(ai)l />
                      `}
              </h1>
              <p className="mx-auto max-w-[700px] text-zinc-500 md:text-lg dark:text-zinc-400">
                Discover the Future of Email Creation
              </p>
              <p className="mx-auto max-w-[700px] text-zinc-500 md:text-lg dark:text-zinc-400">
                Generate stunning emails effortlessly with the power of AI.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 my-4 mx-auto flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="md:w-1/2">
            <Label className="block text-gray-600 dark:text-gray-300">
              Modelo
            </Label>
            <ModelSelect model={model} onChange={setModel} />
          </div>
          <div className="md:w-1/2">
            <Label className="block text-gray-600 dark:text-gray-300">
              API key
            </Label>
            <APIKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />
          </div>
        </div>

        <div className="mt-4 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md p-6 mx-auto">
          <TextBlock
            text={emailRequirements}
            editable={!loading}
            onChange={(value) => {
              setEmailRequirements(value);
              setHasFinished(false);
            }}
          />
          <Button
            className="my-2 self-center rounded-md bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-400"
            onClick={() => handleTranslate()}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Write!"}
          </Button>
        </div>

        <CodeBlock code={outputCode} editable />
      </div>
    </>
  );
}
