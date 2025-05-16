import { CheckOutlined, ExclamationOutlined } from "@ant-design/icons";
import { Switch as AntdSwitch } from "antd";
import { useState } from "react";

const Switch = ({
  showBoolean = true,
  value = false,
}: {
  showBoolean?: boolean;
  value?: boolean;
}) => {
  const [isChecked, setIsChecked] = useState(value);

  return (
    <>
      <AntdSwitch
        disabled
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

export default Switch;
