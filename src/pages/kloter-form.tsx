import {
  ArrowLeftOutlined,
  CloudUploadOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  TableColumnsType,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { constants } from "../helper/constant";
import { numberWithCommas } from "../helper/number-with-commas";
import { kloterService } from "../services/kloter.service";
import { slotService } from "../services/slot.service";
import {
  createKloterParams,
  createSlotParams,
  Slot,
  updateKloterByIdParams,
  updateSlotParams,
} from "../types";

const kloterNextStatus = [
  { label: "Drafted", value: "DRAFTED" },
  { label: "Tersedia", value: "OPEN" },
  { label: "Batal", value: "CANCELLED" },
];

const emptySlotItem = {
  id: 0,
  catalogId: "-",
  payoutAt: "",
  contribution: "-",
  status: "inactive",
  isPayoutAllowed: false,
};

const columnsSlot = (props: {
  setSlotModal: (val: boolean) => void;
  removeModal: (id: number) => void;
  updatePayout: (id: number, val: boolean) => void;
}): TableColumnsType<Slot> => [
  {
    title: "Urutan",
    dataIndex: "id",
    key: "id",
    render: (val, _record, index) => <div>{val ? index + 1 : "-"}</div>,
  },
  {
    title: "Tanggal Pencairan",
    dataIndex: "payoutAt",
    key: "payoutAt",
    render: (val) => {
      return (
        <span>{val ? dayjs(val).format("DD MMM YYYY HH:MM:ss") : "-"} </span>
      );
    },
  },
  {
    title: "Nama",
    dataIndex: "name",
    key: "name",
    render: (val) => <div>{val ?? "-"}</div>,
  },
  {
    title: "Kontribusi",
    dataIndex: "contribution",
    key: "contribution",
    render: (val) => <div>Rp{numberWithCommas(val)}</div>,
  },
  {
    title: "Aksi Pencairan",
    dataIndex: "isPayoutAllowed",
    key: "isPayoutAllowed",
    render: (val, record) => (
      <Switch
        value={val}
        disabled={record.id == 0}
        onClick={(val) => props.updatePayout(record.id, val)}
      />
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: 100,
    align: "end",
    render: (_, record) => (
      <Space>
        {record.id ? (
          <Button onClick={() => props.removeModal(record.id)}>Hapus</Button>
        ) : null}
        <Button
          type="primary"
          onClick={() => props.setSlotModal(true)}
          data-testid="add-slot"
        >
          Isi Data
        </Button>
      </Space>
    ),
  },
];

const KloterForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const isEditing = params.id !== undefined;
  const [form] = Form.useForm();
  const [formAddSlot] = Form.useForm();
  const [slotModal, setSlotModal] = useState(false);
  const [disabledForm, setDisabledForm] = useState(isEditing);
  const [kloterStatus, setKloterStatus] = useState("");
  const [updatedKloterDetail, setUpdatedKloterDetail] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: mutateKloterCreate } = useMutation({
    mutationKey: ["createKloter"],
    mutationFn: (body: createKloterParams) => kloterService.createKloter(body),
    onSuccess: (data) => {
      if (!data) {
        queryClient.invalidateQueries({ queryKey: ["kloters"] });
        notification.success({
          message: "Katalog telah berhasil dibuat.",
          description: "Silakan isi slot yang tersedia dalam daftar katalog",
        });
        navigate(-1);
      }
    },
  });

  const { mutate: mutateKloterUpdate, isPending: isPendingUpdateKloter } =
    useMutation({
      mutationKey: ["updateKloter"],
      mutationFn: (data: updateKloterByIdParams) =>
        kloterService.updateKloterById(data),
      onSuccess: (data, variables) => {
        // error response
        if (data.status && data.status.toString().startsWith("5")) {
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["kloter", params.id] });
        setDisabledForm(true);
        console.log("update kloter", variables);

        notification.success({
          message: "Katalog telah berhasil diupdate.",
        });

        // mean that we update the kloter detail
        if (Object.keys(variables.body).length > 1) {
          setUpdatedKloterDetail(true);
        } else {
          setUpdatedKloterDetail(false);
        }
      },
    });

  const { mutate: mutateSlotCreate, isPending: pendingSlotCreate } =
    useMutation({
      mutationKey: ["createSlot"],
      mutationFn: (data: createSlotParams) => slotService.createSlot(data),
      onSuccess: (data) => {
        if (!data) {
          formAddSlot.resetFields();
          setSlotModal(false);
          queryClient.invalidateQueries({ queryKey: ["slot"] });
          notification.success({
            message: "Slot telah berhasil dibuat",
          });
        }
      },
    });

  const { mutate: mutateSlotDelete, isPending: pendingSlotDelete } =
    useMutation({
      mutationKey: ["deleteSlot"],
      mutationFn: (data: number) => slotService.deleteSlot(data),
      onSuccess: (data) => {
        if (!data) {
          queryClient.invalidateQueries({ queryKey: ["slot"] });
          notification.success({
            message: "Slot telah berhasil dihapus",
          });
        }
      },
    });

  const { mutate: mutateSlotUpdate, isPending: pendingSlotUpdate } =
    useMutation({
      mutationKey: ["updateSlot", params.id],
      mutationFn: (data: updateSlotParams) => slotService.updateSlot(data),
      onSuccess: (data) => {
        if (data.status && data.status.toString().startsWith("5")) {
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["slot", params.id] });
        notification.success({
          message: "Slot telah berhasil diupdate",
        });
      },
    });

  const { mutate: mutateUploadSlotCSV, isPending: pendingUploadSlotCSV } =
    useMutation({
      mutationKey: ["uploadSlotCSV", params.id],
      mutationFn: (data: File) =>
        slotService.uploadCSV({ id: parseInt(params.id ?? "0"), body: data }),
      onSuccess: (data) => {
        if (
          data.status &&
          (data.status.toString().startsWith("5") ||
            data.status.toString().startsWith("4"))
        ) {
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["slot", params.id] });
        notification.success({
          message: "Upload CSV berhasil",
        });
      },
    });

  const { data: detailSlot, isLoading: loadSlot } = useQuery({
    queryKey: ["slot", params.id],
    queryFn: () => slotService.getSlotByCatalogId(parseInt(params.id ?? "0")),
    enabled: isEditing,
  });

  const { data: detailKloter, isLoading: loadingKloter } = useQuery({
    queryKey: ["kloter", params.id],
    queryFn: () => kloterService.getKloterById(parseInt(params.id ?? "0")),
    enabled: isEditing,
  });
  if (detailKloter) {
    form.setFieldsValue({
      ...detailKloter,
      startAt: dayjs(detailKloter.startAt),
      endAt: dayjs(detailKloter.endAt),
      availableAt: dayjs(detailKloter.availableAt),
    });
  }

  const showConfirm = (values: createKloterParams, isEditing: boolean) => {
    if (!isEditing) {
      submitKloter(values);
      return;
    }
    const titleContent = "Apakah anda yakin kamu mengubah data katalog?";
    const textContent =
      "Data yang anda ubah dapat mengubah data yang ditampilkan di UI user";
    Modal.confirm({
      title: titleContent,
      content: textContent,
      okText: "Simpan",
      cancelText: "Batal",
      icon: null,
      centered: true,
      okButtonProps: constants.okButtonProps,
      cancelButtonProps: constants.cancelButtonProps,
      onOk() {
        console.log("Status changed to Tersedia");
        submitKloter(values);
      },
      onCancel() {
        console.log("Canceled");
      },
    });
  };

  const removeModal = (id: number) => {
    Modal.confirm({
      title: "Apakah anda yakin ingin menghapus slot ini?",
      content:
        "Menghapus slot akan menghapus seluruh data transaksi secara permanen dan tidak dapat dikembalikan.",
      okButtonProps: constants.okButtonProps,
      cancelButtonProps: constants.cancelButtonProps,
      onOk() {
        mutateSlotDelete(id);
      },
    });
  };

  const submitKloter = (values: createKloterParams) => {
    const body = {
      ...values,
      status: "DRAFTED", // DRAFTED, CANCELLED, ON_GOING, FINISHED, OPEN
    };
    if (isEditing) {
      if (!params.id) return;
      mutateKloterUpdate({ id: parseInt(params.id), body: body });
    } else {
      mutateKloterCreate(body);
    }
  };

  const submitSlot = (values: createSlotParams) => {
    if (!params.id) return;
    const body = {
      ...values,
      catalogId: parseInt(params.id),
      status: "OPEN",
    };
    mutateSlotCreate(body);
  };

  // groupId dpt drmn, status isi apa
  // list slot itu gmn? soalnya abis create catalog, get slot by id, return array kosong
  // udh coba create slot, pas get slot by id, bener return yg baru dibuat td
  // method patch kena cors
  // di list slot blm ada nama
  // di list kloter blm ada kontribusi
  // di form, status bawah apa aja
  return (
    <>
      <div className="bg-[#F9F9F9] min-h-screen">
        <div className="w-full h-full flex justify-between p-6 text-primary-500 font-semibold bg-white">
          <div
            className="flex gap-3 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftOutlined /> Process Detail
          </div>
          <div className="font-semibold text-primary-500">Buat Kloter</div>
          <div className="flex gap-3">
            <img src="/acr-logo.svg" width={20} alt="" /> ACR Digital
          </div>
        </div>
        <div className="p-6 m-6 rounded-md bg-white">
          <div className="flex justify-between">
            <div className="font-semibold text-xl">Buat Kloter</div>
            {isEditing &&
              (disabledForm ? (
                <Button
                  type="primary"
                  onClick={() => setDisabledForm(!disabledForm)}
                >
                  Edit
                </Button>
              ) : !disabledForm ? (
                <div className="flex gap-3">
                  <Button onClick={() => setDisabledForm(true)}>Cancel</Button>
                  <Button
                    type="primary"
                    onClick={() => form.submit()}
                    loading={isPendingUpdateKloter}
                    disabled={isPendingUpdateKloter}
                  >
                    Simpan
                  </Button>
                </div>
              ) : null)}
          </div>
          <Divider />
          {loadingKloter ? (
            <div className="flex justify-center">
              <Spin size="default" />
            </div>
          ) : (
            <Form
              layout="vertical"
              form={form}
              onFinish={(values) => showConfirm(values, isEditing)}
              onFinishFailed={(err) => console.log(err)}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Title Katalog"
                    name="title"
                    rules={[{ required: true }]}
                  >
                    <Input disabled={disabledForm} data-testid="title" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Group ID"
                    name="groupId"
                    rules={[{ required: true }]}
                  >
                    <Input disabled={disabledForm} data-testid="groupId" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Slot"
                    name="capacity"
                    rules={[
                      {
                        required: true,
                        type: "integer",
                        transform(value) {
                          return value ? parseInt(value) : undefined;
                        },
                      },
                    ]}
                  >
                    <Input disabled={disabledForm} data-testid="capacity" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Rotasi (Hari)"
                    name="cycleDay"
                    rules={[
                      {
                        required: true,
                        type: "integer",
                        transform(value) {
                          return value ? parseInt(value) : undefined;
                        },
                      },
                    ]}
                  >
                    <Input disabled={disabledForm} data-testid="cycleDay" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Periode" name="periode">
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item name="startAt" rules={[{ required: true }]}>
                          <DatePicker
                            placeholder="Awal Periode"
                            style={{ width: "100%" }}
                            disabled={disabledForm}
                            data-testid="startAt"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="endAt" rules={[{ required: true }]}>
                          <DatePicker
                            placeholder="Akhir Periode"
                            style={{ width: "100%" }}
                            disabled={disabledForm}
                            data-testid="endAt"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Pencairan"
                    name="payout"
                    rules={[{ required: true }]}
                  >
                    <Input
                      addonBefore="Rp"
                      disabled={disabledForm}
                      data-testid="payout"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Biaya Admin"
                    name="adminFee"
                    rules={[{ required: true }]}
                  >
                    <Input
                      addonBefore="Rp"
                      disabled={disabledForm}
                      data-testid="adminFee"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Minimum Uang Muka"
                    name="minimumInitialAmount"
                    rules={[{ required: true }]}
                  >
                    <Input
                      addonBefore="Rp"
                      disabled={disabledForm}
                      data-testid="minimumInitialAmount"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tanggal Rilis"
                    name="availableAt"
                    rules={[{ required: true }]}
                  >
                    <DatePicker
                      showTime
                      style={{ width: "100%" }}
                      disabled={disabledForm}
                      data-testid="availableAt"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
        </div>
        {isEditing && detailKloter && detailSlot ? (
          <div className="p-6 m-6 rounded-md bg-white">
            <div className="flex justify-between mb-4">
              <div className="font-semibold text-xl mb-4">Daftar Slot</div>
              <Upload
                beforeUpload={(file: File) => {
                  mutateUploadSlotCSV(file);
                  return false;
                }}
                maxCount={1}
                itemRender={() => null}
              >
                <Button
                  // onClick={() => setSlotModal(true)}
                  disabled={pendingUploadSlotCSV}
                  loading={pendingUploadSlotCSV}
                  icon={<CloudUploadOutlined />}
                  iconPosition="start"
                >
                  Import CSV
                </Button>
              </Upload>
            </div>
            <Table
              columns={columnsSlot({
                setSlotModal,
                removeModal,
                updatePayout: (id, val) =>
                  Modal.confirm({
                    title: `Yakin ingin ${
                      val ? "mengaktifkan" : "menonaktifkan"
                    } pencairan?`,
                    content:
                      "Dengan mengaktifkan pencairan, kontribusi pada slot ini akan diproses untuk dicairkan.",
                    okButtonProps: constants.okButtonProps,
                    cancelButtonProps: constants.cancelButtonProps,
                    okText: val ? "Aktifkan" : "Nonaktifkan",
                    cancelText: "Batal",
                    onOk() {
                      mutateSlotUpdate({
                        id: id,
                        body: { isPayoutAllowed: val },
                      });
                    },
                  }),
              })}
              loading={
                loadSlot ||
                pendingSlotUpdate ||
                pendingSlotDelete ||
                pendingSlotCreate
              }
              dataSource={[
                ...detailSlot,
                ...Array(
                  Math.abs(detailKloter.capacity - detailSlot.length)
                ).fill(emptySlotItem),
              ]}
              pagination={false}
            />
          </div>
        ) : null}
        <div
          className={`bg-white p-6 rounded-lg flex flex-col ${
            isEditing ? "justify-between sticky" : "justify-end fixed"
          }  gap-3 items-center w-full bottom-0`}
        >
          {updatedKloterDetail && (
            <div className=" flex justify-start w-full">
              <div className="bg-warning-100 border-warning-600 border border-solid w-full flex p-2 rounded-lg gap-x-3">
                <InfoCircleFilled
                  color="#db9a00"
                  style={{ color: "#db9a00" }}
                />
                <div>
                  Status ditampilkan menjadi “Drafted”.{" "}
                  <span className="font-semibold">
                    Harap ubah sebelum melakukan submit
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between w-full">
            {isEditing ? (
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">
                  Pilih Respon Status
                </label>
                <Select
                  value={kloterStatus ? kloterStatus : detailKloter?.status}
                  options={kloterNextStatus}
                  key={detailKloter?.status}
                  className="w-48"
                  onChange={(val) => setKloterStatus(val)}
                />
              </div>
            ) : (
              <Button className="w-[200px]" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            )}
            <Button
              type="primary"
              className="w-[200px]"
              data-testid="submit-down"
              disabled={disabledForm == false || isPendingUpdateKloter}
              loading={isPendingUpdateKloter}
              onClick={() => {
                if (isEditing) {
                  const status = kloterStatus
                    ? kloterStatus
                    : detailKloter?.status;
                  Modal.confirm({
                    title: `Apakah kamu yakin ingin mengubah status kloter ke ${
                      kloterNextStatus.find((v) => v.value == status)?.label
                    }?`,
                    content:
                      "Jika status diubah, sistem akan melakukan perubahan pada status seluruh slot dalam kloter ini.",
                    okButtonProps: constants.okButtonProps,
                    cancelButtonProps: constants.cancelButtonProps,
                    centered: true,
                    onOk() {
                      mutateKloterUpdate({
                        body: {
                          status: kloterNextStatus.find(
                            (v) => v.value == status
                          )?.value,
                        },
                        id: params.id ? parseInt(params.id) : 0,
                      });
                    },
                  });
                } else {
                  form.submit();
                }
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <Modal
        open={slotModal}
        onCancel={() => setSlotModal(false)}
        title="Isi Data Slot"
        footer={null}
        destroyOnClose
      >
        <Divider />
        <Form
          form={formAddSlot}
          layout="vertical"
          onFinish={(val) => submitSlot(val)}
        >
          <Form.Item
            label="Tanggal Pencairan"
            name="payoutAt"
            rules={[{ required: true }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Waktu pencairan"
            />
          </Form.Item>
          <Form.Item
            label="Kontribusi"
            name="contribution"
            rules={[{ required: true }]}
          >
            <Input addonBefore="Rp" />
          </Form.Item>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" className="w-[100px]">
              Simpan
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default KloterForm;
