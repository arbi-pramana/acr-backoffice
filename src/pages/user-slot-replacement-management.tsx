import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Input, Table, Modal, message } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "../components/chip";
import Pagination from "../components/pagination";
import { numberWithCommas } from "../helper/number-with-commas";
import { userSlotReplacementService } from "../services/user-slot-replacement.service";
import { UserSlotReplacement } from "../types";

const columns = (props: {
  navigate: (val: string) => void;
  onApprove: (id: number) => void;
}): ColumnsType<UserSlotReplacement> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
  },
  {
    title: "Catalog",
    dataIndex: "catalogTitle",
    key: "catalogTitle",
    width: 220,
  },
  {
    title: "Old User",
    key: "oldUser",
    render: (_, record) => (
      <div>
        {record.oldUserName}{" "}
        {record.oldUserEmail ? `(${record.oldUserEmail})` : ""}
      </div>
    ),
  },
  {
    title: "New User",
    key: "newUser",
    render: (_, record) => (
      <div>
        {record.newUserName}{" "}
        {record.newUserEmail ? `(${record.newUserEmail})` : ""}
      </div>
    ),
  },
  {
    title: "Fee",
    dataIndex: "fee",
    key: "fee",
    width: 120,
    render: (val) => <div>Rp{numberWithCommas(val)}</div>,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (value) => <div>{value ?? "N/A"}</div>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) =>
      value === "APPROVED" ? (
        <Chip variant="success" label="Approved" />
      ) : value === "EXECUTED" ? (
        <Chip variant="success" label="Executed" />
      ) : value === "PENDING" ? (
        <Chip variant="warning" label="Pending" />
      ) : (
        <Chip variant="danger" label={value ?? "Unknown"} />
      ),
  },
  {
    title: "Executed By",
    dataIndex: "executedByEmail",
    key: "executedByEmail",
    width: 180,
    render: (v, r) => (
      <div>{v ?? (r.executedById ? `ID ${r.executedById}` : "N/A")}</div>
    ),
  },
  {
    title: "Created By",
    dataIndex: "createdByEmail",
    key: "createdByEmail",
    width: 180,
    render: (v, r) => (
      <div>{v ?? (r.createdById ? `ID ${r.createdById}` : "N/A")}</div>
    ),
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => <div>{dayjs(date).format("DD MMMM YYYY HH:mm")}</div>,
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    dataIndex: "id",
    render: (id, record) => (
      <div className="flex gap-2">
        {record.status === "WAITING_PAYMENT" && (
          <Button type="primary" onClick={() => props.onApprove(id)}>
            Approve
          </Button>
        )}
        <Button
          type="default"
          onClick={() => props.navigate("/user-slot-replacement-form/" + id)}
        >
          Detail
        </Button>
      </div>
    ),
  },
];

const UserSlotReplacementManagement = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    search: "",
    sort: "createdAt,DESC",
  });

  const {
    data: userSlotReplacements,
    isLoading: loadingUserSlotReplacement,
    refetch,
  } = useQuery({
    queryFn: () => userSlotReplacementService.getUserSlotReplacements(params),
    queryKey: ["userSlotReplacements", params],
  });

  const handleApprove = (id: number) => {
    Modal.confirm({
      title: "Konfirmasi",
      content: "apakah anda ingin approve user replacement ini",
      onOk: async () => {
        try {
          await userSlotReplacementService.approveById(id);
          message.success("User replacement berhasil di-approve");
          await refetch();
        } catch (e: any) {
          message.error(e?.message ?? "Gagal approve user replacement");
        }
      },
    });
  };

  // const { data: userSlotReplacementDashboard } = useQuery({
  //   queryFn: () => userSlotReplacementService.getUserSlotReplacementDashboard(),
  //   queryKey: ["userSlotReplacementDashboard"],
  // });

  return (
    <>
      <div className="bg-white flex justify-between items-center">
        <div className="flex items-center justify-end h-full">
          <div>
            <div className="font-semibold text-2xl">User Slot Replacement</div>
            <div className="text-gray-500">Manage user slot replacement</div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => navigate("/user-slot-replacement-form")}
          >
            Add
          </Button>
        </div>
      </div>
      <div className="flex justify-between my-4">
        <DatePicker.RangePicker
          placeholder={["Tanggal Awal", "Tanggal Akhir"]}
          onChange={(v) => {
            if (v) {
              setParams((prev) => ({
                ...prev,
                createdAtFrom: dayjs(v[0]).format("YYYY-MM-DDTHH:mm:ss+00:00"),
                createdAtTo: dayjs(v[1]).format("YYYY-MM-DDTHH:mm:ss+00:00"),
              }));
            } else if (v === null) {
              setParams((prev) => ({
                ...prev,
                createdAtFrom: "",
                createdAtTo: "",
              }));
            }
          }}
        />
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
        columns={columns({ navigate, onApprove: handleApprove })}
        dataSource={userSlotReplacements?.content ?? []}
        pagination={false}
        loading={loadingUserSlotReplacement}
        rowKey="id"
      />
      {userSlotReplacements && (
        <div className="mt-4">
          <Pagination
            pageNumber={
              userSlotReplacements.pageable.pageNumber !== null
                ? userSlotReplacements.pageable.pageNumber
                : 0
            }
            totalPages={userSlotReplacements.totalPages}
            pageSize={
              userSlotReplacements.pageable.pageSize !== null
                ? userSlotReplacements.pageable.pageSize
                : 0
            }
            onChange={(val) => setParams((prev) => ({ ...prev, page: val }))}
          />
        </div>
      )}
    </>
  );
};

export default UserSlotReplacementManagement;
