import {
  CloudUploadOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Input, notification, Table, Upload } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "../components/chip";
import Pagination from "../components/pagination";
import { numberWithCommas } from "../helper/number-with-commas";
import { voucherService } from "../services/voucher.service";
import { Voucher } from "../types";

const columns = (props: {
  navigate: (val: string) => void;
}): ColumnsType<Voucher> => [
  // {
  //     title: "Voucher ID",
  //     dataIndex: "id",
  //     key: "id",
  //     width: 100,
  // },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    width: 120,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 150,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (value) => <div>{value ?? "N/A"}</div>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (value) => (
      <div>{value === "percentage" ? "Percentage" : "Fixed"}</div>
    ),
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
    width: 150,
    render: (val) => <div>Rp{numberWithCommas(val)}</div>,
  },
  {
    title: "Quota",
    dataIndex: "quota",
    key: "quota",
    width: 100,
  },
  {
    title: "Quota Used",
    dataIndex: "quotaUsed",
    key: "quotaUsed",
    width: 100,
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    render: (date) => <div>{dayjs(date).format("DD MMMM YYYY")}</div>,
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
    render: (date) => <div>{dayjs(date).format("DD MMMM YYYY")}</div>,
  },
  {
    title: "Status",
    dataIndex: "isActive",
    key: "isActive",
    render: (value) =>
      value ? (
        <Chip variant="success" label="Active" />
      ) : (
        <Chip variant="danger" label="Inactive" />
      ),
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    dataIndex: "code",
    render: (code) => (
      <Button
        type="default"
        onClick={() => props.navigate("/voucher-form/" + code)}
      >
        Detail
      </Button>
    ),
  },
];

const VoucherManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    search: "",
    sort: "createdAt,DESC",
  });

  const { data: vouchers, isLoading: loadingVoucher } = useQuery({
    queryFn: () => voucherService.getVouchers(params),
    queryKey: ["vouchers", params],
  });

  // const { data: voucherDashboard } = useQuery({
  //   queryFn: () => voucherService.getVoucherDashboard(),
  //   queryKey: ["voucherDashboard"],
  // });

  const { mutate: mutateUploadVoucherCSV, isPending: pendingUploadVoucherCSV } =
    useMutation({
      mutationFn: (data: File) => voucherService.uploadCSV(data),
      onSuccess: (data) => {
        if (
          data.status &&
          (data.status.toString().startsWith("5") ||
            data.status.toString().startsWith("4"))
        ) {
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["vouchers"] });
        notification.success({
          message: "Upload Voucher berhasil",
        });
      },
    });

  return (
    <>
      <div className="bg-white flex justify-between items-center">
        <div className="flex items-center justify-end h-full">
          <div>
            <div className="font-semibold text-2xl">Voucher Management</div>
            <div className="text-gray-500">
              Track, manage and forecast your customers and orders.
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Upload
            beforeUpload={(file: File) => {
              mutateUploadVoucherCSV(file);
              return false;
            }}
            itemRender={() => null}
            maxCount={1}
          >
            <Button
              loading={pendingUploadVoucherCSV}
              disabled={pendingUploadVoucherCSV}
              icon={<CloudUploadOutlined />}
            >
              Import CSV
            </Button>
          </Upload>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => navigate("/voucher-form")}
          >
            Add
          </Button>
        </div>
      </div>
      {/* <div className="flex gap-2 my-4">
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">Jumlah Voucher</div>
          <div className="font-semibold text-4xl">
            {voucherDashboard?.totalVouchers ?? <Spin size="small" />}
          </div>
        </div>
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">Voucher Aktif</div>
          <div className="font-semibold text-4xl">
            {voucherDashboard?.activeVouchers ?? <Spin size="small" />}
          </div>
        </div>
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">Voucher Batal</div>
          <div className="font-semibold text-4xl">
            {voucherDashboard?.inactiveVouchers ?? <Spin size="small" />}
          </div>
        </div>
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">Voucher Expired</div>
          <div className="font-semibold text-4xl">
            {voucherDashboard?.expiringVouchers ?? <Spin size="small" />}
          </div>
        </div>
      </div> */}
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
            } else if (v == null) {
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
        columns={columns({ navigate })}
        dataSource={vouchers?.content ?? []}
        pagination={false}
        loading={loadingVoucher}
        rowKey="id"
      />
      {vouchers && (
        <div className="mt-4">
          <Pagination
            pageNumber={
              vouchers.pageable.pageNumber !== null
                ? vouchers.pageable.pageNumber
                : 0
            }
            totalPages={vouchers.totalPages}
            pageSize={
              vouchers.pageable.pageSize !== null
                ? vouchers.pageable.pageSize
                : 0
            }
            onChange={(val) => setParams((prev) => ({ ...prev, page: val }))}
          />
        </div>
      )}
    </>
  );
};

export default VoucherManagement;
