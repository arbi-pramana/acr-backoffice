import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Skeleton, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chip from "../components/chip";
import { storage } from "../helper/local-storage";
import { numberWithCommas } from "../helper/number-with-commas";
import { accountService } from "../services/account.service";
import { AccountCatalog } from "../types";

const catalogColumns = (props: {
  setDetail: (v: AccountCatalog) => void;
}): ColumnsType<AccountCatalog> => [
  {
    title: "Kloter ID",
    dataIndex: "groupId",
    key: "kloterId-catalog",
    width: 100,
    render: (text: number) => <span className="font-semibold">{text}</span>,
  },
  {
    title: "Status Kloter",
    dataIndex: "status",
    key: "status-catalog",
    width: 150,
    render: (value: string) =>
      value == "OPEN" ? (
        <Chip variant="success" label="Tersedia" />
      ) : value == "DRAFTED" ? (
        <Chip variant="default" label="Drafted" />
      ) : value == "CANCELLED" ? (
        <Chip variant="danger" label="Batal" />
      ) : value == "FINISHED" ? (
        <Chip variant="info" label="Selesai" />
      ) : value == "ON_GOING" ? (
        <Chip variant="warning" label="Sedang Berjalan" />
      ) : null,
  },
  {
    title: "Total Pencairan",
    dataIndex: "payout",
    key: "totalPencairan-catalog",
    width: 150,
    render: (text: string) => (
      <span className="font-semibold">
        Rp{numberWithCommas(parseInt(text))}
      </span>
    ),
  },
  {
    title: "Kontribusi",
    dataIndex: "totalContribution",
    key: "kontribusi-catalog",
    render: (text: string) => (
      <span className="font-semibold">
        Rp{numberWithCommas(parseInt(text))}
      </span>
    ),
  },
  {
    title: "Total Putaran",
    dataIndex: "capacity",
    key: "total-putaran-catalog",
    width: 150,
  },
  {
    title: "Slot dipilih",
    dataIndex: "slots",
    key: "slot-catalog-catalog",
    render: (_, record) => (
      <span className="font-semibold">
        {record.slots.map((v) => v.number).join(", ")}
      </span>
    ),
  },
  {
    title: "Periode",
    dataIndex: "",
    width: 200,
    key: "periode-catalog",
    render: (_, record) => (
      <span className="font-semibold">
        {dayjs(record.startAt).format("DD/MM/YYYY")} -{" "}
        {dayjs(record.endAt).format("DD/MM/YYYY")}
      </span>
    ),
  },
  {
    title: "Detail Slot",
    // dataIndex: "",
    render: (_, record) => (
      <Button
        type="primary"
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-4"
        onClick={() => props.setDetail(record)}
      >
        Lihat Detail
      </Button>
    ),
  },
];

const AccountForm = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const params = useParams();

  const { data: detailAccount, isLoading: loadAccount } = useQuery({
    queryKey: ["detail-account", params.id],
    queryFn: () => accountService.getAccountById(params.id ?? ""),
  });

  const { data: accountCatalog, isLoading: loadAccountCatalog } = useQuery({
    queryKey: [params.id, selectedTab],
    queryFn: () =>
      accountService.getAccountCatalog(params.id ?? "", {
        statuses:
          selectedTab == 0 ? "DRAFTED,ON_GOING,OPEN,CANCELLED" : "FINISHED",
      }),
  });

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
        {loadAccount ? (
          <Skeleton active />
        ) : (
          <>
            <div className="font-semibold text-lg mb-4">Detail Account</div>
            <div className="space-y-2 mb-6">
              <div className="flex">
                <div className="w-40 text-gray-500">Nama Account</div>
                <div className="font-medium text-black">
                  {detailAccount?.fullName}
                </div>
              </div>
              <div className="flex">
                <div className="w-40 text-gray-500">Email</div>
                <div className="font-medium text-black">
                  {detailAccount?.email}
                </div>
              </div>
              <div className="flex">
                <div className="w-40 text-gray-500">Nomer HP</div>
                <div className="font-medium text-black">
                  {detailAccount?.mobile}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  Jumlah Kloter diambil
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {detailAccount?.totalCatalogs}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  Sedang berlangsung
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {detailAccount?.totalOnGoingCatalogs}
                </div>
              </div>
            </div>
          </>
        )}
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
        <Table
          columns={catalogColumns({
            setDetail: (record: AccountCatalog) => {
              navigate(`/account-form/${params.id}/${record.catalogId}`);
              storage.setItem("catalog", JSON.stringify(record));
            },
          })}
          pagination={false}
          key={`catalog-table-${params.id}`}
          loading={loadAccountCatalog}
          dataSource={accountCatalog?.content}
          rowKey={() => Date.now() + Math.random()}
        />
      </div>
    </div>
  );
};

export default AccountForm;
