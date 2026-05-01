import { Input } from "antd";
import Switch from "./switch";

export const InputMatch = ({
  value,
  isMatch = false,
  label,
  ocrData,
  onCheck,
}: {
  label: string;
  value?: string;
  isMatch?: boolean;
  ocrData?: string;
  onCheck?: (isMatch: boolean, value?: string, ocrData?: string) => void;
}) => {
  return (
    <>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3 mt-2">
        <Input defaultValue={value} className="w-full" disabled={isMatch} />
        <Switch
          value={isMatch}
onClick={() => {
             onCheck?.(!isMatch, value, ocrData);
           }}
        />
      </div>
    </>
  );
};
