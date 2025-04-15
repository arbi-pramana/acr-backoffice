import {
  CloudUploadOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/pagination";
import { kloterService } from "../services/kloter.service";
import { Kloter } from "../types";

const columns = (props: {
  navigate: (val: string) => void;
}): ColumnsType<Kloter> => [
  {
    title: "Kloter ID",
    dataIndex: "kloterId",
    key: "kloterId",
  },
  {
    title: "Nama",
    dataIndex: "nama",
    key: "nama",
    render: (text: string) => (
      <span className="text-purple-600 font-medium cursor-pointer hover:underline">
        {text}
      </span>
    ),
  },
  {
    title: "Jumlah Kloter diambil",
    dataIndex: "jumlahKloter",
    key: "jumlahKloter",
    width: 200,
    render: (value: number) => <span className="font-semibold">{value}</span>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text: string) => <span className="font-semibold">{text}</span>,
  },
  {
    title: "No HP",
    dataIndex: "noHp",
    key: "noHp",
    render: (text: string) => <span className="font-semibold">{text}</span>,
  },
  {
    title: "Detail account",
    key: "action",
    render: (_, record) => (
      <Button
        type="primary"
        className="bg-gradient-to-r from-purple-500 to-pink-500"
        onClick={() => props.navigate(`/kloter/${record.id}`)}
      >
        Lihat Detail
      </Button>
    ),
  },
];

const AccountManagement = () => {
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
            <div className="font-semibold text-2xl">Account Management</div>
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

export default AccountManagement;
