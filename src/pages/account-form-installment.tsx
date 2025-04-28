import {
  ArrowLeftOutlined,
  CopyOutlined,
  DownOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Modal, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chip from "../components/chip";
import { storage } from "../helper/local-storage";
import { numberWithCommas } from "../helper/number-with-commas";
import { accountService } from "../services/account.service";
import { AccountCatalog, AccountInstallment } from "../types";

const installmentColumns = (props: {
  setDetailPayout: (id: number) => void;
}): ColumnsType<AccountInstallment> => [
  {
    title: "Urutan",
    dataIndex: "-",
    key: "catalog-id-installment",
    render: (_, __, key) => key + 1,
  },
  {
    title: "Tanggal",
    dataIndex: "dueAt",
    key: "tanggal-installment",
    render: (value: string) => <div>{dayjs(value).format("DD-MM-YYYY")}</div>,
  },
  {
    title: "Jumlah Kontribusi",
    dataIndex: "totalAmount",
    key: "total-amount-installment",
    render: (value: string) => <div>Rp{numberWithCommas(parseInt(value))}</div>,
  },
  {
    title: "Status",
    dataIndex: "installmentStatus",
    key: "installment-status-installment",
    render: (value: string) =>
      value == "PAID" ? (
        <Chip variant="success" label="Sudah Lunas" />
      ) : value == "UNPAID" ? (
        <Chip variant="warning" label="Belum Dibayar" />
      ) : null,
  },
  {
    title: "Status Rotasi",
    dataIndex: "rotationStatus",
    key: "rotation-status-installment",
    render: (value: string) =>
      value == "NOT_STARTED" ? (
        <Chip variant="warning" label="Belum Dimulai" />
      ) : value == "FINISHED" ? (
        <Chip variant="default" label="Sudah Lewat" />
      ) : value == "ON_PROGRESS" ? (
        <Chip variant="success" label="Sedang Berjalan" />
      ) : null,
  },
  {
    title: "Aksi Pembayaran",
    dataIndex: "isYourPayout",
    key: "is-your-payout-installment",
  },
  {
    title: "Aksi Pencairan",
    dataIndex: "isYourPayout",
    key: "is-your-payout-installment",
    render: (value, record) =>
      value ? (
        <Button
          icon={<FileSearchOutlined />}
          iconPosition="end"
          onClick={() => props.setDetailPayout(record.catalogId)}
        >
          Bukti Pencairan
        </Button>
      ) : null,
  },
];

const AccountInstallments = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [detailTransactionModal, setDetailTransactionModal] = useState(false);
  const [detailKloter] = useState<AccountCatalog | null>(
    storage.getItem("catalog", true)
  );
  const [, setDetailPayout] = useState<number | null>(null);
  console.log("sad", storage.getItem("catalog", true));

  const { data: accountInstallment, isLoading: loadAccountInstallment } =
    useQuery({
      queryKey: ["account-installment", params.id],
      queryFn: () =>
        accountService.getAccountInstallment(
          params.id ?? "",
          detailKloter?.catalogId ?? 0
        ),
      //   enabled: detailKloter !== null,
    });
  const getCatalogStatus = (value: string) => {
    return value == "OPEN" ? (
      <Chip variant="success" label="Tersedia" />
    ) : value == "DRAFTED" ? (
      <Chip variant="default" label="Drafted" />
    ) : value == "CANCELLED" ? (
      <Chip variant="danger" label="Batal" />
    ) : value == "FINISHED" ? (
      <Chip variant="info" label="Selesai" />
    ) : value == "ON_GOING" ? (
      <Chip variant="warning" label="Sedang Berjalan" />
    ) : null;
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("catalog");
    };
  }, []);

  if (!detailKloter) return null;

  return (
    <>
      <div className="p-4 m-4 bg-white rounded-md">
        <div
          className="font-semibold text-lg mb-4 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftOutlined className="mr-2" />
          Detail
        </div>
        <Divider />
        <div className="flex flex-row justify-between w-full">
          {/* Left Section */}
          <div className="w-[50%]">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-bold gradient">
                Kloter {detailKloter.catalogId}
              </h1>
              {getCatalogStatus(detailKloter.status)}
            </div>
            <p className="text-gray-600 font-medium">
              Rp{numberWithCommas(detailKloter.payout)} / ?? hari
            </p>
          </div>

          {/* Right Section */}
          <div className="text-sm w-[50%] space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">
                Total Pencairan:
              </span>
              <span className="text-black font-semibold">
                Rp{numberWithCommas(detailKloter.payout)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">
                Total Kontribusi Anda:
              </span>
              <span className="text-black font-semibold">
                Rp{numberWithCommas(detailKloter.totalContribution)}
              </span>
            </div>
            <div className="flex justify-between border-dotted border-b border-gray-300 pb-1">
              <span className="text-gray-700 font-medium">Slot Terpilih:</span>
              <span className="text-black font-semibold">
                {detailKloter.slots.map((v) => v.id).join(", ")}
              </span>
            </div>
            <div className="flex justify-end text-xs text-gray-500 pt-1">
              Periode: ??
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-primary-500/8 text-primary-500 text-sm font-medium px-4 py-2 rounded-full mt-6 flex justify-between w-[50%]">
          <span>Putaran Berlangsung:</span>
          <span>??/{detailKloter.capacity}</span>
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
          columns={installmentColumns({
            setDetailPayout: (id: number) => setDetailPayout(id),
          })}
          key={`installment-table-${params.id}-${detailKloter.catalogId}`}
          dataSource={accountInstallment}
          loading={loadAccountInstallment}
          rowKey={() => Date.now() + Math.random()}
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Total Biaya Kontribusi / Rotasi</div>
                <div>Rp 1,640,000</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Uang Muka yang Sudah Dibayar</div>
                <div>- Rp 530,000</div>
              </div>
            </Space>

            <Divider />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="font-semibold">Sisa Biaya yang Harus Dibayar</div>
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
  );
};

export default AccountInstallments;
