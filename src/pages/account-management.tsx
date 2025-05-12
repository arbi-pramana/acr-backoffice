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
import { accountService } from "../services/account.service";
import { AccountList } from "../types";

const columns = (props: {
  navigate: (val: string) => void;
}): ColumnsType<AccountList> => [
  {
    title: "Nama",
    dataIndex: "fullName",
    key: "nama",
    render: (text: string, record) => (
      <span
        className="text-purple-600 font-medium cursor-pointer hover:underline"
        onClick={() => props.navigate(`/account-form/${record.id}`)}
      >
        {text ?? "-"}
      </span>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text: string) => <span className="font-semibold">{text}</span>,
  },
  {
    title: "No HP",
    dataIndex: "mobile",
    key: "noHp",
    render: (text: string) => (
      <span className="font-semibold">{text ?? "-"}</span>
    ),
  },
  {
    title: "Detail account",
    key: "action",
    render: (_, record) => (
      <Button
        type="primary"
        className="bg-gradient-to-r from-purple-500 to-pink-500"
        onClick={() => props.navigate(`/account-form/${record.id}`)}
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
    sort: "desc",
  });

  const { data: accounts, isLoading: loadingAccount } = useQuery({
    queryFn: () => accountService.getAccounts(params),
    queryKey: ["accounts", params],
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
        dataSource={accounts?.content ?? []}
        pagination={false}
        loading={loadingAccount}
        rowKey="id"
      />
      {accounts && (
        <div className="mt-4">
          <Pagination
            pageNumber={
              accounts.pageable.pageNumber !== null
                ? accounts.pageable.pageNumber
                : 0
            }
            totalPages={accounts.totalPages}
            pageSize={
              accounts.pageable.pageSize !== null
                ? accounts.pageable.pageSize
                : 0
            }
            onChange={(val) => setParams((prev) => ({ ...prev, page: val }))}
          />
        </div>
      )}
    </>
  );
};

export default AccountManagement;
