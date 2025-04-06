import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  Switch,
  Table,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { kloterService } from "../services/kloter.service";
import { slotService } from "../services/slot.service";
import {
  createKloterParams,
  createSlotParams,
  updateKloterByIdParams,
} from "../types";

const columns = (props: { setSlotModal: (val: boolean) => void }) => [
  {
    title: "Urutan",
    dataIndex: "urutan",
    key: "urutan",
  },
  {
    title: "Tanggal Pencairan",
    dataIndex: "tanggalPencairan",
    key: "tanggalPencairan",
  },
  {
    title: "Nama",
    dataIndex: "nama",
    key: "nama",
  },
  {
    title: "Kontribusi",
    dataIndex: "kontribusi",
    key: "kontribusi",
  },
  {
    title: "Aksi Pencairan",
    dataIndex: "aksiPencairan",
    key: "aksiPencairan",
    render: () => <Switch />,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: 100,
    render: () => (
      <Space>
        <Button>Hapus</Button>
        <Button type="primary" onClick={() => props.setSlotModal(true)}>
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

  const data = Array.from({ length: 8 }, (_, i) => ({
    key: i + 1,
    urutan: i + 1,
    tanggalPencairan: "-",
    nama: "-",
    kontribusi: "-",
  }));

  const { mutate: mutateKloterCreate } = useMutation({
    mutationKey: ["createKloter"],
    mutationFn: (body: createKloterParams) => kloterService.createKloter(body),
    onSuccess: (data) => {
      if (!data) {
        notification.success({
          message: "Katalog telah berhasil dibuat.",
          description: "Silakan isi slot yang tersedia dalam daftar katalog",
        });
        navigate(-1);
      }
    },
  });

  const { mutate: mutateKloterUpdate } = useMutation({
    mutationKey: ["updateKloter"],
    mutationFn: (data: updateKloterByIdParams) =>
      kloterService.updateKloterById(data),
    onSuccess: (data) => {
      if (!data) {
        notification.success({
          message: "Katalog telah berhasil diupdate.",
        });
      }
    },
  });

  const { mutate: mutateSlotCreate } = useMutation({
    mutationKey: ["updateKloter"],
    mutationFn: (data: createSlotParams) => slotService.createSlot(data),
    onSuccess: (data) => {
      if (!data) {
        notification.success({
          message: "Slot telah berhasil dibuat",
        });
      }
    },
  });

  // const { data: detailSlot } = useQuery({
  //   queryKey: ["slot", params.id],
  //   queryFn: () => slotService.getSlotByCatalogId(parseInt(params.id ?? "0")),
  //   enabled: isEditing,
  // });

  const { data: detailKloter } = useQuery({
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
    const titleContent = isEditing
      ? "Apakah anda yakin kamu mengubah data katalog?"
      : 'Apakah kamu yakin ingin mengubah status kloter ke "Tersedia"?';
    const textContent = isEditing
      ? "Data yang anda ubah dapat mengubah data yang ditampilakn di UI user"
      : 'Status kloter akan berubah menjadi "Tersedia" dan akan dipublikasikan';
    Modal.confirm({
      title: titleContent,
      content: textContent,
      okText: "Simpan",
      cancelText: "Batal",
      icon: null,
      okButtonProps: {
        style: {
          backgroundColor: "#9F4ABC",
          color: "white",
          borderRadius: "9999px",
          padding: "8px 24px",
          fontWeight: 600,
        },
      },
      cancelButtonProps: {
        style: {
          backgroundColor: "#EEEEF0",
          color: "black",
          borderRadius: "9999px",
          padding: "8px 24px",
          fontWeight: 600,
        },
      },
      onOk() {
        console.log("Status changed to Tersedia");
        submitKloter(values);
      },
      onCancel() {
        console.log("Canceled");
      },
    });
  };

  const submitKloter = (values: createKloterParams) => {
    const body = {
      ...values,
      groupId: 5,
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
                  <Button type="primary" onClick={() => form.submit()}>
                    Simpan
                  </Button>
                </div>
              ) : null)}
          </div>
          <Divider />
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
                  <Input disabled={disabledForm} />
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
                  <Input disabled={disabledForm} />
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
                  <Input disabled={disabledForm} />
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
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="endAt" rules={[{ required: true }]}>
                        <DatePicker
                          placeholder="Akhir Periode"
                          style={{ width: "100%" }}
                          disabled={disabledForm}
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
                  <Input addonBefore="Rp" disabled={disabledForm} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Biaya Admin"
                  name="adminFee"
                  rules={[{ required: true }]}
                >
                  <Input addonBefore="Rp" disabled={disabledForm} />
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
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        {isEditing ? (
          <div className="p-6 m-6 rounded-md bg-white">
            <div className="font-semibold text-xl mb-4">Daftar Slot</div>
            <Table
              columns={columns({ setSlotModal })}
              dataSource={data}
              pagination={false}
            />
          </div>
        ) : null}
        <div
          className={`bg-white p-6 rounded-lg flex ${
            isEditing ? "justify-between sticky" : "justify-end fixed"
          }  gap-3 items-center w-full bottom-0`}
        >
          {isEditing ? (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Pilih Respon Status</label>
              <Select
                defaultValue="DRAFTED"
                options={[
                  { label: "Drafted", value: "DRAFTED" },
                  { label: "Open", value: "OPEN" },
                  { label: "On Going", value: "ON_GOING" },
                  { label: "Finished", value: "FINISHED" },
                  { label: "Cancelled", value: "CANCELLED" },
                ]}
                className="w-48"
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
            onClick={() =>
              isEditing
                ? {
                    /** action update status */
                  }
                : form.submit()
            }
          >
            Submit
          </Button>
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
