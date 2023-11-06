import { StreamLanguage } from "@codemirror/language";
import { go } from "@codemirror/legacy-modes/mode/go";
import CodeMirror from "@uiw/react-codemirror";
import { FC, useEffect, useState } from "react";
import { Button } from "./ui/button";

interface Props {
  code: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export const CodeBlock: FC<Props> = ({
  code,
  editable = false,
  onChange = () => {},
}) => {
  const [copyText, setCopyText] = useState<string>("Copy");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopyText("Copy");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copyText]);

  return (
    <div className="mt-4 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md p-6 mx-auto">
      {/* CodeMirror and Preview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
        {/* CodeMirror Section */}
        <CodeMirror
          editable={editable}
          value={code}
          extensions={[StreamLanguage.define(go)]}
          theme={"light"}
          onChange={(value) => onChange(value)}
          className="border border-gray-300 rounded-md p-4 text-black"
        />
        <div
          className="w-full mt-4 md:mt-0  rounded-md p-4 text-black"
          dangerouslySetInnerHTML={{
            __html: code.replace("```html", "").replace("```", ""),
          }}
        />
      </div>
      <Button
        className="my-2 self-center rounded-md bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-400"
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopyText("Copied!");
        }}
      >
        {copyText}
      </Button>
    </div>
  );
};
