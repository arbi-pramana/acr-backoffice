import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, notification, Table, Upload } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "../components/chip";
import Pagination from "../components/pagination";
import { numberWithCommas } from "../helper/number-with-commas";
import { invoiceGetService } from "../services/invoice-get.service";
import { InvoiceGet } from "../types";

const columns = (props: {
  navigate: (val: string) => void;
}): ColumnsType<InvoiceGet> => [
  {
    title: "UUID",
    dataIndex: "uuid",
    key: "uuid",
    width: 200,
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
    width: 120,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: 150,
    render: (val) => <div>Rp{numberWithCommas(val)}</div>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (value) => <Chip variant="default" label={value} />,
  },
  {
    title: "Status Trigger",
    dataIndex: "statusTrigger",
    key: "statusTrigger",
    width: 120,
    render: (value) =>
      value ? (
        <Chip variant="success" label="Yes" />
      ) : (
        <Chip variant="danger" label="No" />
      ),
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 150,
    render: (date) => <div>{dayjs(date).format("DD MMMM YYYY")}</div>,
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    dataIndex: "uuid",
    render: (uuid) => (
      <Button
        type="default"
        onClick={() => props.navigate("/invoice-get/" + uuid)}
      >
        Detail
      </Button>
    ),
  },
];

const InvoiceGetManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    search: "",
    sort: "createdAt,DESC",
  });

  const { data: invoieGets, isLoading: loadingInvoiceGet } = useQuery({
    queryFn: () => invoiceGetService.getInvoiceGets(params),
    queryKey: ["invoieGets", params],
  });

  // const { data: invoieGetDashboard } = useQuery({
  //   queryFn: () => invoiceGetService.getInvoiceGetDashboard(),
  //   queryKey: ["invoieGetDashboard"],
  // });

  const { mutate: mutateUploadInvoiceGetCSV } = useMutation({
    mutationFn: (data: File) => invoiceGetService.uploadCSV(data),
    onSuccess: (data) => {
      if (
        data.status &&
        (data.status.toString().startsWith("5") ||
          data.status.toString().startsWith("4"))
      ) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["invoieGets"] });
      notification.success({
        message: "Upload InvoiceGet berhasil",
      });
    },
  });

  return (
    <>
      <div className="bg-white flex justify-between items-center">
        <div className="flex items-center justify-end h-full">
          <div>
            <div className="font-semibold text-2xl">Invoice Get Management</div>
            <div className="text-gray-500">
              Manage your invoice get data here.
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Upload
            beforeUpload={(file: File) => {
              mutateUploadInvoiceGetCSV(file);
              return false;
            }}
            itemRender={() => null}
            maxCount={1}
          >
            {/* <Button
              loading={pendingUploadInvoiceGetCSV}
              disabled={pendingUploadInvoiceGetCSV}
              icon={<CloudUploadOutlined />}
            >
              Import CSV
            </Button> */}
          </Upload>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => navigate("/invoice-get")}
          >
            Add
          </Button>
        </div>
      </div>
      {/* <div className="flex gap-2 my-4">
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">Jumlah InvoiceGet</div>
          <div className="font-semibold text-4xl">
            {invoieGetDashboard?.totalInvoiceGets ?? <Spin size="small" />}
          </div>
        </div>
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">InvoiceGet Aktif</div>
          <div className="font-semibold text-4xl">
            {invoieGetDashboard?.activeInvoiceGets ?? <Spin size="small" />}
          </div>
        </div>
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">InvoiceGet Batal</div>
          <div className="font-semibold text-4xl">
            {invoieGetDashboard?.inactiveInvoiceGets ?? <Spin size="small" />}
          </div>
        </div>
        <div className="border border-solid rounded-md border-gray-200 p-6 w-full">
          <div className="font-semibold text-sm">InvoiceGet Expired</div>
          <div className="font-semibold text-4xl">
            {invoieGetDashboard?.expiringInvoiceGets ?? <Spin size="small" />}
          </div>
        </div>
      </div> */}
      {/* <div className="flex justify-between my-4">
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
      </div> */}
      <Table
        scroll={{ x: "max-content", y: "auto" }}
        columns={columns({ navigate })}
        dataSource={invoieGets?.content ?? []}
        pagination={false}
        loading={loadingInvoiceGet}
        rowKey="id"
      />
      {invoieGets && (
        <div className="mt-4">
          <Pagination
            pageNumber={
              invoieGets.pageable.pageNumber !== null
                ? invoieGets.pageable.pageNumber
                : 0
            }
            totalPages={invoieGets.totalPages}
            pageSize={
              invoieGets.pageable.pageSize !== null
                ? invoieGets.pageable.pageSize
                : 0
            }
            onChange={(val) => setParams((prev) => ({ ...prev, page: val }))}
          />
        </div>
      )}
    </>
  );
};

export default InvoiceGetManagement;
