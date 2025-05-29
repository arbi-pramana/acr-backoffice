import {
  CloudUploadOutlined,
  FileSearchOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Input, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "../components/chip";
import Pagination from "../components/pagination";
import { kycService } from "../services/kyc.service";
import { KYCList } from "../types";

const columns = (props: {
  navigate: (url: string) => void;
}): ColumnsType<KYCList> => [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "user",
    render: (text: string) => (text ? text : "-"),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "documentType",
  },
  {
    title: "Status Level 1",
    dataIndex: "statusLevelOne",
    key: "status",
    render: (text: string) => (
      <Chip
        label={
          text == "REJECTED"
            ? "Ditolak"
            : text == "IN_PROGRESS"
            ? "Sedang Berjalan"
            : text == "IN_REVIEW"
            ? "Sedang Ditinjau"
            : text == "APPROVED"
            ? "Disetujui"
            : "-"
        }
        variant={
          text == "REJECTED"
            ? "danger"
            : text == "IN_REVIEW"
            ? "warning"
            : text == "IN_PROGRESS"
            ? "info"
            : text == "APPROVED"
            ? "success"
            : "default"
        }
      />
    ),
  },
  {
    title: "Status Level 2",
    dataIndex: "statusLevelTwo",
    key: "date",
    minWidth: 170,
    render: (text: string) => (
      <Chip
        label={
          text == "REJECTED"
            ? "Ditolak"
            : text == "IN_PROGRESS"
            ? "Sedang Berjalan"
            : text == "IN_REVIEW"
            ? "Sedang Ditinjau"
            : text == "APPROVED"
            ? "Disetujui"
            : "-"
        }
        variant={
          text == "REJECTED"
            ? "danger"
            : text == "IN_REVIEW"
            ? // inprogress biru
              "warning"
            : text == "IN_PROGRESS"
            ? "info"
            : text == "APPROVED"
            ? "success"
            : "default"
        }
      />
    ),
  },
  {
    title: "Current Stage",
    dataIndex: "currentStage",
    key: "date",
    render: (text) => {
      return text == "ID_CARD_UPLOAD" ? (
        <div>Upload KTP</div>
      ) : text == "ID_CARD_SELFIE_UPLOAD" ? (
        <div>Upload Selfie KTP</div>
      ) : text == "DATA_VERIFICATION" ? (
        <div>Verifikasi Data</div>
      ) : text == "BANK_VERIFICATION" ? (
        <div>Verifikasi Bank</div>
      ) : text == "OCCUPATION_INFORMATION" ? (
        <div>Informasi Pekerjaan</div>
      ) : text == "FAMILY_CARD_UPLOAD" ? (
        <div>Upload KK</div>
      ) : text == "GUARANTOR_INFORMATION" ? (
        <div>Informasi Penjamin</div>
      ) : text == "DONE" ? (
        <div>Selesai</div>
      ) : (
        "-"
      );
    },
  },
  {
    title: "Tanggal Submit",
    dataIndex: "submittedAt",
    key: "date",
    render: (text) => {
      return <div>{dayjs(text).format("DD MMMM YYYY HH:MM:ss")}</div>;
    },
  },
  {
    title: "Action",
    key: "actions",
    fixed: "right",
    render: (_: unknown, record: { uuid: string }) => (
      <Button
        type="default"
        icon={<FileSearchOutlined />}
        iconPosition="end"
        onClick={() => props.navigate("/kyc-form?id=" + record.uuid)}
      >
        Detail
      </Button>
    ),
  },
];

const KYCManagement = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    search: "",
    sort: "createdAt,desc",
  });

  const { data: kycs, isLoading: loadingKycs } = useQuery({
    queryFn: () => kycService.getKycs(params),
    queryKey: ["kycs", params],
  });

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
          <DatePicker.RangePicker
            placeholder={["Tanggal Awal", "Tanggal Akhir"]}
            onChange={(v) => {
              if (v) {
                setParams((prev) => ({
                  ...prev,
                  fromDateTime: dayjs(v[0]).format("YYYY-MM-DDTHH:mm:ss+00:00"),
                  toDateTime: dayjs(v[1]).format("YYYY-MM-DDTHH:mm:ss+00:00"),
                }));
              } else if (v == null) {
                setParams((prev) => ({
                  ...prev,
                  fromDateTime: "",
                  toDateTime: "",
                }));
              }
            }}
          />
        </div>
        <div>
          <Input
            addonBefore={<SearchOutlined />}
            placeholder="Cari data"
            onChange={(e) =>
              setParams((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>
      </div>
      <Table
        columns={columns({ navigate })}
        dataSource={kycs?.content}
        pagination={false}
        loading={loadingKycs}
        scroll={{ x: "max-content", y: "auto" }}
      />
      <div className="mt-4">
        <Pagination
          pageNumber={kycs?.pageable.pageNumber ? kycs?.pageable.pageNumber : 0}
          totalPages={kycs?.totalPages ? kycs?.totalPages : 0}
          pageSize={kycs?.pageable.pageSize ? kycs?.pageable.pageSize : 0}
          onChange={(val) => setParams((prev) => ({ ...prev, page: val }))}
        />
      </div>
    </>
  );
};

export default KYCManagement;
