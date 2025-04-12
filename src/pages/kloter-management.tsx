import {
  CloudUploadOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "../components/chip";
import Pagination from "../components/pagination";
import { numberWithCommas } from "../helper/number-with-commas";
import { kloterService } from "../services/kloter.service";
import { Kloter } from "../types";

const columns = (props: {
  navigate: (val: string) => void;
}): ColumnsType<Kloter> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 70,
  },
  {
    title: "Title Katalog",
    dataIndex: "title",
    key: "price",
    width: 120,
  },
  {
    title: "Rotasi",
    dataIndex: "cycleDay",
    key: "rotation",
    width: 100,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) =>
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
    title: "Period",
    dataIndex: "period",
    key: "period",
    align: "center",
    render: (_period, record) => (
      <div className="h-full">
        {`${dayjs(record.startAt).format("DD MMMM YYYY")} | ${dayjs(
          record.startAt
        ).format("HH:MM:ss")}`}{" "}
        -{" "}
        {`${dayjs(record.endAt).format("DD MMMM YYYY")} | ${dayjs(
          record.endAt
        ).format("HH:MM:ss")}`}
      </div>
    ),
  },
  {
    title: "Tanggal Rilis",
    dataIndex: "availableAt",
    key: "availableAt",
    align: "center",
    render: (period) => (
      <div className="h-full">
        {dayjs(period).format("DD MMMM YYYY")} |{" "}
        {dayjs(period).format("HH:MM:ss")}
      </div>
    ),
  },
  {
    title: "Jumlah Slot",
    dataIndex: "capacity",
    key: "capacity",
    width: 150,
  },
  {
    title: "Pencairan",
    dataIndex: "payout",
    key: "payout",
    width: 150,
    render: (val) => <div>Rp{numberWithCommas(val)}</div>,
  },
  {
    title: "Kontribusi",
    dataIndex: "contribution",
    key: "contribution",
    width: 150,
    render: (value) => (
      <div>
        Rp{numberWithCommas(value?.lowest ?? 0)} - Rp
        {numberWithCommas(value?.highest ?? 0)}
      </div>
    ),
  },
  {
    title: "Biaya Admin",
    dataIndex: "adminFee",
    key: "adminFee",
    width: 150,
    render: (val) => <div>Rp{numberWithCommas(val)}</div>,
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    dataIndex: "id",
    render: (id) => (
      <Button
        type="primary"
        onClick={() => props.navigate("/kloter-form/" + id)}
      >
        Detail
      </Button>
    ),
  },
];

const KloterManagement = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    search: "",
  });

  const { data: kloters } = useQuery({
    queryFn: () => kloterService.getKloters(params),
    queryKey: ["kloters", params],
  });

  return (
    <>
      <div className="bg-white flex justify-between items-center">
        <div className="flex items-center justify-end h-full">
          <div>
            <div className="font-semibold text-2xl">Kloter Management</div>
            <div className="text-gray-500">
              Track, manage and forecast your customers and orders.
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button icon={<CloudUploadOutlined />}>Export</Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => navigate("/kloter-form")}
          >
            Add
          </Button>
        </div>
      </div>
      <div className="flex gap-2 my-4">
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">Jumlah Kloter</div>
          <div className="font-semibold text-4xl">1,210</div>
        </div>
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">Kloter Rilis</div>
          <div className="font-semibold text-4xl">316</div>
        </div>
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">Kloter Batal</div>
          <div className="font-semibold text-4xl">316</div>
        </div>
      </div>
      <div className="flex justify-between my-4">
        <DatePicker placeholder="Tanggal Submit" />
        <Input
          addonBefore={<SearchOutlined />}
          style={{ width: "fit-content" }}
          placeholder="Search"
          onChange={(e) =>
            setParams((prev) => ({ ...prev, search: e.target.value }))
          }
        />
      </div>
      <Table
        scroll={{ x: "max-content", y: "auto" }}
        columns={columns({ navigate })}
        dataSource={kloters?.content ?? []}
        pagination={false}
        rowKey="id"
      />
      {kloters && (
        <div className="mt-4">
          <Pagination
            pageNumber={
              kloters.pageable.pageNumber !== null
                ? kloters.pageable.pageNumber
                : 0
            }
            totalPages={kloters.totalPages}
            pageSize={
              kloters.pageable.pageSize !== null ? kloters.pageable.pageSize : 0
            }
            onChange={(val) => setParams((prev) => ({ ...prev, page: val }))}
          />
        </div>
      )}
    </>
  );
};

export default KloterManagement;
