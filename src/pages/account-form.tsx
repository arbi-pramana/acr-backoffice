import {
  ArrowLeftOutlined,
  CopyOutlined,
  DownOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { Button, Divider, Modal, Space, Table, Tag } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "../components/chip";

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

const contributionColumns = [
  {
    title: "Urutan",
    dataIndex: "urutan",
    key: "urutan",
  },
  {
    title: "Tanggal",
    dataIndex: "tanggal",
    key: "tanggal",
  },
  {
    title: "Jumlah Kontribusi",
    dataIndex: "jumlahKontribusi",
    key: "jumlahKontribusi",
    render: (value: string) => <strong>{value}</strong>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const color = status === "Sudah Lunas" ? "#e8f9b7" : "#fef3c7";
      const textColor = status === "Sudah Lunas" ? "#4d7c0f" : "#b45309";
      return (
        <Tag
          color={color}
          style={{ color: textColor, fontWeight: 600, borderRadius: 999 }}
        >
          {status}
        </Tag>
      );
    },
  },
  {
    title: "Status Rotasi",
    dataIndex: "statusRotasi",
    key: "statusRotasi",
    render: (status: string) => (
      <Tag
        color="#e8f9b7"
        style={{ color: "#4d7c0f", fontWeight: 600, borderRadius: 999 }}
      >
        {status}
      </Tag>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_: unknown, record: { status: string }) => {
      if (record.status === "Sudah Lunas") {
        return (
          <FileSearchOutlined style={{ color: "#8b5cf6", fontSize: 16 }} />
        );
      }
      return (
        <Button type="default" disabled style={{ borderRadius: 999 }}>
          Bayar Sekarang
        </Button>
      );
    },
  },
];

const AccountForm = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [detailTransactionModal, setDetailTransactionModal] = useState(false);
  const ha = true;
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
      {ha ? (
        <>
          <div className="p-4 m-4 bg-white rounded-md">
            <div className="font-semibold text-lg mb-4">Detail</div>
            <Divider />
            <div className="flex flex-row justify-between w-full">
              {/* Left Section */}
              <div className="w-[50%]">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl font-bold gradient">Kloter 626</h1>
                  <Chip label="Belum Dimulai" variant="warning" />
                </div>
                <p className="text-gray-600 font-medium">
                  Rp 10,000,000 / 7 hari
                </p>
              </div>

              {/* Right Section */}
              <div className="text-sm w-[50%] space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">
                    Total Pencairan:
                  </span>
                  <span className="text-black font-semibold">
                    Rp 30,000,000
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">
                    Total Kontribusi Anda:
                  </span>
                  <span className="text-black font-semibold">Rp 3,085,000</span>
                </div>
                <div className="flex justify-between border-dotted border-b border-gray-300 pb-1">
                  <span className="text-gray-700 font-medium">
                    Slot Terpilih:
                  </span>
                  <span className="text-black font-semibold">1,3,7</span>
                </div>
                <div className="flex justify-end text-xs text-gray-500 pt-1">
                  Periode: 11/03/25 - 24/04/25
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-primary-500/8 text-primary-500 text-sm font-medium px-4 py-2 rounded-full mt-6 flex justify-between w-[50%]">
              <span>Putaran Berlangsung:</span>
              <span>7/10</span>
            </div>
          </div>
          <div className="p-4 m-4 bg-white rounded-md">
            <div
              className="font-semibold text-lg mb-4"
              onClick={() => setDetailTransactionModal(true)}
            >
              List kontribusi pembayaran
            </div>
            <Divider />
            <Table
              columns={contributionColumns}
              dataSource={[
                {
                  key: "1",
                  urutan: 2,
                  tanggal: "28-02-2025",
                  jumlahKontribusi: "Rp 3,085,000",
                  status: "Sudah Lunas",
                  statusRotasi: "Sedang Berlangsung",
                },
              ]}
              pagination={false}
            />

            <Modal
              open={detailTransactionModal}
              onCancel={() => setDetailTransactionModal(false)}
              title={<div className="gradient">Detail Transaksi</div>}
              footer={null}
            >
              <div className="bg-[#f9fafb] rounded-lg p-6 mb-4 text-sm">
                <div>
                  <div className="flex justify-between">
                    <div>ID Transaksi</div>
                    <div>
                      98037299874 <CopyOutlined style={{ marginLeft: 8 }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <div>Kloter ID</div>
                      <div>
                        K1234 <CopyOutlined style={{ marginLeft: 8 }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Tanggal</div>
                    <div>22/02/25, 12:00</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Produk</div>
                    <div>Rp 5,000,000 / 7 Hari</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Tipe Transaksi</div>
                    <div>Giliran Bayar</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Status</div>
                    <Chip label="Lunas" variant="success" />
                  </div>
                </div>
              </div>
              <div className="bg-[#f9fafb] rounded-lg p-6">
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>Total Biaya Kontribusi / Rotasi</div>
                    <div>Rp 1,640,000</div>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>Uang Muka yang Sudah Dibayar</div>
                    <div>- Rp 530,000</div>
                  </div>
                </Space>

                <Divider />

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="font-semibold">
                    Sisa Biaya yang Harus Dibayar
                  </div>
                  <div className="font-semibold gradient">Rp 1,110,000</div>
                </div>

                <div className="text-center mt-4">
                  <Button
                    type="link"
                    icon={<DownOutlined />}
                    style={{ color: "#9f4abc" }}
                  >
                    Tampilkan Detail
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </>
      ) : (
        <>
          <div className="p-4 m-4 bg-white rounded-md">
            <div className="font-semibold text-lg mb-4">Detail Account</div>

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
                <div className="text-sm text-gray-600 mb-1">
                  Sedang berlangsung
                </div>
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
        </>
      )}
    </div>
  );
};

export default AccountForm;
