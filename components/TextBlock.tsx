import { Textarea } from "./ui/textarea";

interface Props {
  text: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export const TextBlock: React.FC<Props> = ({
  text,
  editable = false,
  onChange = () => {},
}) => {
  return (
    <Textarea
      className="min-h-32 w-full p-4 text-[15px] text-black focus:outline-none"
      value={text}
      onChange={(e) => onChange(e.target.value)}
      disabled={!editable}
      placeholder="Write an email to my boss about the new product launch, include a list of the top 3 features and why they are important."
    />
  );
};
