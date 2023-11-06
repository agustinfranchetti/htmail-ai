import { Input } from "./ui/input";

interface Props {
  apiKey: string;
  onChange: (apiKey: string) => void;
}

export const APIKeyInput: React.FC<Props> = ({ apiKey, onChange }) => {
  return (
    <Input
      className="w-full border-gray-300 rounded-md p-4"
      placeholder="Enter API Key"
      type="password"
      value={apiKey}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
