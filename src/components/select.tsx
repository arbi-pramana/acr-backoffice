import { Select as AntdSelect, SelectProps } from "antd";

const Select = (props: SelectProps) => {
  return (
    <AntdSelect
      placeholder="Tanggal Submit"
      variant="borderless"
      style={{
        border: "1px solid #dadadd",
        borderRadius: 16,
      }}
      className="placeholder-black"
      options={[{ label: "option 1", value: 1 }]}
      {...props}
    />
  );
};

export default Select;
