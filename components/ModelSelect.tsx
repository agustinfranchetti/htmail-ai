import { OpenAIModel } from "@/types/types";
import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  model: OpenAIModel;
  onChange: (model: OpenAIModel) => void;
}

export const ModelSelect: FC<Props> = ({ model, onChange }) => {
  const handleChange = (selectedModel: OpenAIModel) => {
    onChange(selectedModel);
  };

  return (
    <Select value={model} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectGroup>
          <SelectLabel>Models</SelectLabel>
          <SelectItem value="gpt-3.5-turbo">GPT-3.5</SelectItem>
          <SelectItem value="gpt-4">GPT-4</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
