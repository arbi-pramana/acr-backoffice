import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    title: "Kloter ID",
    dataIndex: "kloterId",
    key: "kloterId",
    render: (text: number) => <span className="font-semibold">{text}</span>,
  },
  {
    title: "Status Kloter",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag
        color="#f5fbd7"
        className="text-green-800 font-semibold px-3 py-1 rounded-full"
      >
        {status}
      </Tag>
    ),
  },
  {
    title: "Total Pencairan",
    dataIndex: "totalPencairan",
    key: "totalPencairan",
    render: (text: string) => <span className="font-semibold">{text}</span>,
  },
  {
    title: "Kontribusi",
    dataIndex: "kontribusi",
    key: "kontribusi",
    render: (text: string) => <span className="font-semibold">{text}</span>,
  },
  {
    title: "Total Putaran",
    dataIndex: "totalPutaran",
    key: "totalPutaran",
  },
  {
    title: "Slot dipilih",
    dataIndex: "slotDipilih",
    key: "slotDipilih",
  },
  {
    title: "Periode",
    dataIndex: "periode",
    key: "periode",
    render: (text: string) => <span className="font-semibold">{text}</span>,
  },
  {
    title: "Detail Slot",
    key: "action",
    render: () => (
      <Button
        type="primary"
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-4"
        // onClick={() => console.log("Lihat detail", record)}
      >
        Lihat Detail
      </Button>
    ),
  },
];

const AccountForm = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <div className="w-full h-full flex justify-between p-6 text-primary-500 font-semibold bg-white">
        <div className="flex gap-3 cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeftOutlined /> Process Detail
        </div>
        <div className="font-semibold text-primary-500">Detail Account</div>
        <div className="flex gap-3">
          <img src="/acr-logo.svg" width={20} alt="" /> ACR Digital
        </div>
      </div>
      <div className="p-4 m-4 bg-white rounded-md">
        <h2 className="font-semibold text-lg mb-4">Detail Account</h2>

        {/* Account Info */}
        <div className="space-y-2 mb-6">
          <div className="flex">
            <div className="w-40 text-gray-500">Nama Account</div>
            <div className="font-medium text-black">Scoot Travis</div>
          </div>
          <div className="flex">
            <div className="w-40 text-gray-500">Email</div>
            <div className="font-medium text-black">goog@gmail.com</div>
          </div>
          <div className="flex">
            <div className="w-40 text-gray-500">Nomer HP</div>
            <div className="font-medium text-black">+62 837595983</div>
          </div>
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">
              Jumlah Kloter diambil
            </div>
            <div className="text-3xl font-bold text-gray-900">8</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Sedang berlangsung</div>
            <div className="text-3xl font-bold text-gray-900">4</div>
          </div>
        </div>
      </div>
      <div className="p-4 m-4 bg-white rounded-md">
        <h2 className="font-semibold text-lg mb-4">List Arisan Diambil</h2>
        <div className="flex gap-3 mb-5">
          <Button
            type={selectedTab == 0 ? "primary" : "default"}
            onClick={() => setSelectedTab(0)}
          >
            Arisan Diambil
          </Button>
          <Button
            type={selectedTab == 1 ? "primary" : "default"}
            onClick={() => setSelectedTab(1)}
          >
            Riwayat Arisan
          </Button>
        </div>
        <Table columns={columns} dataSource={[]} />
      </div>
    </div>
  );
};

export default AccountForm;
