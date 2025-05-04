import {
  CheckOutlined,
  ExclamationOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Switch } from "antd";

const OCRGuide = () => {
  return (
    <div className="w-[80%] bg-gradient-to-r from-primary-400 to-primary-600 text-white p-4 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <InfoCircleOutlined className="text-lg" />
        <span className="font-semibold">Identifikasi sesuai dengan OCR</span>
      </div>
      <p className="text-sm opacity-90">
        Pastikan ikuti Panduan untuk mengetahui data yang sudah benar atau
        tidak.
      </p>

      {/* OCR Status Section */}
      <div className="mt-4 bg-white p-3 rounded-lg text-black grid grid-cols-2 gap-2 text-center">
        {/* True Option */}
        <div>
          <p className="text-sm font-semibold">Data OCR yang Sesuai</p>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<ExclamationOutlined />}
            defaultChecked
            className="mt-2"
            disabled
            style={{
              backgroundColor: "#97c90e",
            }}
          />
          <p className="text-sm font-semibold mt-1 text-gray-700">True</p>
        </div>

        {/* False Option */}
        <div>
          <p className="text-sm font-semibold">Data OCR yang Sesuai</p>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<ExclamationOutlined />}
            defaultChecked={false}
            className="mt-2"
            disabled
            style={{
              backgroundColor: "#D22F45",
            }}
          />
          <p className="text-sm font-semibold mt-1 text-gray-700">False</p>
        </div>
      </div>
    </div>
  );
};

export default OCRGuide;
