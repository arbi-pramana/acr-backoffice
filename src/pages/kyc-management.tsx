import {
  CloudUploadOutlined,
  FileSearchOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Input, Table } from "antd";
import Select from "../components/select";
import Chip from "../components/chip";
import Pagination from "../components/pagination";
import { useNavigate } from "react-router-dom";

const data = [
  {
    key: "1",
    user: "John Doe",
    email: "kai27@gmail.com",
    documentType: "Passport",
    status: "Rejected",
    status_2: "Rejected",
    stage: "ID Card Upload",
    date: "2025-01-15",
  },
  {
    key: "2",
    user: "Jane Smith",
    email: "kai27@gmail.com",
    documentType: "Driver's License",
    status: "In Review",
    status_2: "In Review",
    stage: "ID Card Upload",
    date: "2025-01-14",
  },
  {
    key: "3",
    user: "Jane Smith",
    email: "kai27@gmail.com",
    documentType: "Driver's License",
    status: "Approved",
    status_2: "Approved",
    stage: "ID Card Upload",
    date: "2025-01-14",
  },
];

const columns = (props: { navigate: (url: string) => void }) => [
  {
    title: "Name",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "documentType",
  },
  {
    title: "Status Level 1",
    dataIndex: "status",
    key: "status",
    render: (text: string) => (
      <Chip
        label={text}
        variant={
          text == "Rejected"
            ? "danger"
            : text == "In Review"
            ? "warning"
            : text == "Approved"
            ? "success"
            : "default"
        }
      />
    ),
  },
  {
    title: "Status Level 2",
    dataIndex: "status_2",
    key: "date",
    render: (text: string) => (
      <Chip
        label={text}
        variant={
          text == "Rejected"
            ? "danger"
            : text == "In Review"
            ? "warning"
            : text == "Approved"
            ? "success"
            : "default"
        }
      />
    ),
  },
  {
    title: "Current Stage",
    dataIndex: "stage",
    key: "date",
  },
  {
    title: "Tanggal Submit",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Action",
    key: "actions",
    render: () => (
      <button
        onClick={() => props.navigate("/kyc-form")}
        className="bg-primary-100 px-4 py-2 rounded-full text-primary-600 cursor-pointer hover:bg-primary-200 active:bg-primary-300"
      >
        Proses <FileSearchOutlined />
      </button>
    ),
  },
];

const KYCManagement = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white flex justify-between items-center">
        <div className="flex items-center justify-end h-full">
          <div>
            <div className="font-semibold text-2xl">KYC Management</div>
            <div className="text-gray-500">
              Track, manage and forecast your customers and orders.
            </div>
          </div>
        </div>
        <Button icon={<CloudUploadOutlined />}>Export</Button>
      </div>
      <div className="flex justify-between my-3">
        <div className="flex gap-2">
          <Select
            placeholder="Status Level"
            options={[
              { value: "level1", label: "Level 1" },
              { value: "level2", label: "Level 2" },
            ]}
          />
          <DatePicker placeholder="Tanggal Submit" />
        </div>
        <div>
          <Input addonBefore={<SearchOutlined />} placeholder="Cari data" />
        </div>
      </div>
      <Table
        columns={columns({ navigate })}
        dataSource={data}
        pagination={false}
      />
      <div className="mt-4">
        <Pagination />
      </div>
    </>
  );
};

export default KYCManagement;
