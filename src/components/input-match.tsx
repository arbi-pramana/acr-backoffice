import { Input } from "antd";
import Switch from "./switch";

export const InputMatch = ({
  value,
  isMatch = false,
  label,
  onChange,
}: {
  label: string;
  value?: string;
  isMatch?: boolean;
  onChange?: (checked: boolean) => void;
}) => {
  return (
    <>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3 mt-2">
        <Input defaultValue={value} className="w-full" />
        <Switch value={isMatch} onChange={onChange} />
      </div>
    </>
  );
};
