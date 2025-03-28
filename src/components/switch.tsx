import { Switch } from "antd";
import { CheckOutlined, ExclamationOutlined } from "@ant-design/icons";
import { useState } from "react";

const ToggleSwitch = ({ showBoolean = true }: { showBoolean?: boolean }) => {
  const [isChecked, setIsChecked] = useState(true);

  return (
    <>
      <Switch
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
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

export default ToggleSwitch;
