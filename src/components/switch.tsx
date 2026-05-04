import { CheckOutlined, ExclamationOutlined } from "@ant-design/icons";
import { Switch as AntdSwitch } from "antd";
import { useEffect, useState } from "react";

const Switch = ({
  showBoolean = true,
  value = false,
  disabled = false,
  onChange,
}: {
  showBoolean?: boolean;
  value?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) => {
  const [isChecked, setIsChecked] = useState(value);

  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    onChange?.(checked);
  };

  return (
    <>
      <AntdSwitch
        disabled={disabled}
        checked={isChecked}
        onChange={handleChange}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<ExclamationOutlined />}
        className={`[&_.ant-switch-inner]:flex [&_.ant-switch-inner]:items-center [&_.ant-switch-inner]:justify-center ${
          isChecked ? "!bg-green-500" : "!bg-red-500"
        }`}
      />
      {showBoolean && <span>{isChecked.toString()}</span>}
    </>
  );
};

export default Switch;
