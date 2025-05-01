import {
  ArrowLeftOutlined,
  CopyOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Modal, Result, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chip from "../components/chip";
import { copyToClipboard } from "../helper/copy-to-clipboard";
import { storage } from "../helper/local-storage";
import { numberWithCommas } from "../helper/number-with-commas";
import { accountService } from "../services/account.service";
import { kloterService } from "../services/kloter.service";
import { AccountCatalog, AccountInstallment } from "../types";

const installmentColumns = (props: {
  setDetailPayout: (id: AccountInstallment) => void;
  setDetailPayment: (id: AccountInstallment) => void;
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
    dataIndex: "",
    key: "is-your-payout-installment",
    render: (_, record) => (
      <Button
        icon={<FileSearchOutlined />}
        iconPosition="end"
        onClick={() => props.setDetailPayment(record)}
      >
        Bukti Transaksi
      </Button>
    ),
  },
  {
    title: "Aksi Pencairan",
    dataIndex: "",
    key: "is-your-payout-installment",
    render: (_, record) => (
      <Button
        icon={<FileSearchOutlined />}
        iconPosition="end"
        onClick={() => props.setDetailPayout(record)}
      >
        Bukti Pencairan
      </Button>
    ),
  },
];

const AccountInstallments = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [detailKloter, setDetailKloter] = useState<AccountCatalog | null>(null);
  const [detailPayout, setDetailPayout] = useState<AccountInstallment | null>(
    null
  );
  const [detailPayment, setDetailPayment] = useState<AccountInstallment | null>(
    null
  );

  const { data: accountInstallment, isLoading: loadAccountInstallment } =
    useQuery({
      queryKey: ["account-installment", params.id],
      queryFn: () =>
        accountService.getAccountInstallment(
          params.id ?? "",
          detailKloter?.catalogId ?? 0
        ),
      enabled: detailKloter !== null,
    });

  const { data: detailKloterFromAPI } = useQuery({
    queryKey: ["kloter", params.id],
    queryFn: () => kloterService.getKloterById(detailKloter?.catalogId ?? 0),
    enabled: detailKloter !== null,
  });

  const { data: detailInstallmentPayout } = useQuery({
    queryKey: ["detail-installment-payout", params.id],
    queryFn: () =>
      accountService.getAccountInstallmentPayout(
        params.id ?? "",
        detailPayout?.installmentIds ?? []
      ),
    enabled: detailPayout !== null,
  });

  const { data: detailInstallmentPayment } = useQuery({
    queryKey: ["detail-installment-payment", params.id],
    queryFn: () =>
      accountService.getAccountInstallmentPayment(
        params.id ?? "",
        detailPayment?.installmentIds ?? []
      ),
    enabled: detailPayment !== null,
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
    setDetailKloter(storage.getItem("catalog", true));
    // return () => {
    //   localStorage.removeItem("catalog");
    // };
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
              Rp{numberWithCommas(detailKloter.payout)} /{" "}
              {detailKloterFromAPI?.cycleDay} hari
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
                {detailKloter.slots.map((v) => v.number).join(", ")}
              </span>
            </div>
            <div className="flex justify-end text-xs text-gray-500 pt-1">
              Periode: {dayjs(detailKloter.startAt).format("DD/MM/YYYY")} -{" "}
              {dayjs(detailKloter.endAt).format("DD/MM/YYYY")}
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
        <div className="font-semibold text-lg mb-4">
          List kontribusi pembayaran
        </div>
        <Divider />
        <Table
          columns={installmentColumns({
            setDetailPayout: (record: AccountInstallment) =>
              setDetailPayout(record),
            setDetailPayment: (record: AccountInstallment) =>
              setDetailPayment(record),
          })}
          key={`installment-table-${params.id}-${detailKloter.catalogId}`}
          dataSource={accountInstallment}
          loading={loadAccountInstallment}
          rowKey={() => Date.now() + Math.random()}
          pagination={false}
        />

        <Modal
          open={detailPayout !== null}
          onCancel={() => setDetailPayout(null)}
          title={<div className="gradient">Detail Transaksi</div>}
          footer={null}
          centered
        >
          {detailInstallmentPayout && detailInstallmentPayout?.length > 0 ? (
            <>
              {detailInstallmentPayout?.map((v) => (
                <div className="bg-[#f9fafb] rounded-lg p-6 mb-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div>ID Transaksi</div>
                      <div>
                        {v.transactionCode}{" "}
                        <CopyOutlined style={{ marginLeft: 8 }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <div>Kloter ID</div>
                        <div>
                          {detailKloter.groupId}{" "}
                          <CopyOutlined style={{ marginLeft: 8 }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>Tanggal</div>
                      <div>{dayjs(v.createdAt).format("DD/MM/YY, HH:MM")}</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Produk</div>
                      <div>
                        Rp{numberWithCommas(detailKloter.payout)} /{" "}
                        {detailKloterFromAPI?.cycleDay} hari
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>Status</div>
                      <Chip
                        label={
                          v.status == "SUCCESS"
                            ? "Success"
                            : v.status == "PENDING"
                            ? "Pending"
                            : v.status == "FAILED"
                            ? "Gagal"
                            : ""
                        }
                        variant={
                          v.status == "SUCCESS"
                            ? "success"
                            : v.status == "PENDING"
                            ? "warning"
                            : v.status == "FAILED"
                            ? "danger"
                            : "default"
                        }
                      />
                    </div>
                  </div>
                  {/* <div className="bg-[#f9fafb] rounded-lg p-6 space-y-2"> */}
                  <div className="text-center font-semibold">
                    <div>Jumlah Uang Cair</div>
                    <div className="gradient text-xl">
                      Rp{numberWithCommas(v.payoutAmount)}
                    </div>
                  </div>
                  <div className="text-center font-semibold">
                    <div>Nama Bank</div>
                    <div className="gradient text-xl">
                      {v.recipientDetails.code}
                    </div>
                  </div>
                  <div className="text-center font-semibold">
                    <div>Nomor Rekening</div>
                    <div className="gradient text-xl">
                      {v.recipientDetails.number}
                    </div>
                  </div>
                  <div className="text-center font-semibold">
                    <div>Atas Nama</div>
                    <div className="gradient text-xl">
                      {v.recipientDetails.holderName}
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              ))}
              <div className="text-xs text-center mt-3">
                Permintaan pencairan uang akan diproses dalam waktu maksimal 1
                hari kerja.
              </div>
            </>
          ) : (
            <Result status="404" title="No payout found" />
          )}
        </Modal>
        <Modal
          open={detailPayment !== null}
          centered
          onCancel={() => setDetailPayment(null)}
          title={<div className="gradient">Detail Transaksi</div>}
          footer={null}
        >
          {detailInstallmentPayment && detailInstallmentPayment?.length > 0 ? (
            <>
              {detailInstallmentPayment?.map((v) => (
                <div className="bg-[#f9fafb] rounded-lg p-6 mb-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div>ID Transaksi</div>
                      <div>
                        {v.transactionCode}{" "}
                        <CopyOutlined
                          style={{ marginLeft: 8, cursor: "pointer" }}
                          onClick={() => copyToClipboard(v.transactionCode)}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <div>Kloter ID</div>
                        <div>
                          {detailKloter.groupId}{" "}
                          <CopyOutlined
                            style={{ marginLeft: 8, cursor: "pointer" }}
                            onClick={() =>
                              copyToClipboard(detailKloter.groupId)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>Tanggal</div>
                      <div>{dayjs(v.createdAt).format("DD/MM/YY, HH:MM")}</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Produk</div>
                      <div>
                        Rp{numberWithCommas(detailKloter.payout)} /{" "}
                        {detailKloterFromAPI?.cycleDay} hari
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>Tipe Transaksi</div>
                      <div>
                        {v.type == "INITIAL_PAYMENT"
                          ? "Uang Muka"
                          : v.type == "CONTRIBUTION_PAYMENT"
                          ? "Giliran Bayar"
                          : v.type == "DISBURSEMENT"
                          ? "Pencairan"
                          : ""}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>Status</div>
                      <Chip
                        label={
                          v.status == "SUCCESS"
                            ? "Success"
                            : v.status == "PENDING"
                            ? "Pending"
                            : v.status == "FAILED"
                            ? "Gagal"
                            : ""
                        }
                        variant={
                          v.status == "SUCCESS"
                            ? "success"
                            : v.status == "PENDING"
                            ? "warning"
                            : v.status == "FAILED"
                            ? "danger"
                            : "default"
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <Result status="404" title="No payment found" />
          )}
        </Modal>
      </div>
    </>
  );
};

export default AccountInstallments;
