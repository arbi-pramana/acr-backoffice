import { ArrowLeftOutlined, InfoCircleFilled } from "@ant-design/icons";
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
  Spin,
  Switch,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { constants } from "../helper/constant";
import { voucherService } from "../services/voucher.service";
import { createVoucherParams, updateVoucherByIdParams } from "../types";

const VoucherForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const isEditing = params.code !== undefined;
  const [form] = Form.useForm();
  const [disabledForm, setDisabledForm] = useState(isEditing);
  const [updatedVoucherDetail, setUpdatedVoucherDetail] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: mutateVoucherCreate } = useMutation({
    mutationKey: ["createVoucher"],
    mutationFn: (body: createVoucherParams) =>
      voucherService.createVoucher(body),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["vouchers"] });
        notification.success({
          message: "Voucher berhasil dibuat.",
        });
        navigate(`/dashboard?tab=voucher`);
      }
    },
  });

  const { mutate: mutateVoucherUpdate, isPending: isPendingUpdateVoucher } =
    useMutation({
      mutationKey: ["updateVoucher"],
      mutationFn: (data: updateVoucherByIdParams) =>
        voucherService.updateVoucherById(data),
      onSuccess: (data, variables) => {
        // error response
        if (data.status && data.status.toString().startsWith("5")) {
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["voucher", params.code] });
        setDisabledForm(true);
        console.log("update voucher", variables);

        notification.success({
          message: "Voucher berhasil diupdate.",
        });

        // mean that we update the voucher detail
        if (
          Object.keys(variables.body).length > 1 &&
          "status" in variables.body
        ) {
          setUpdatedVoucherDetail(true);
        } else {
          setUpdatedVoucherDetail(false);
        }
      },
    });

  const {
    data: detailVoucher,
    isLoading: loadingDetailVoucher,
    isFetching: fetchingDetailVoucher,
  } = useQuery({
    queryKey: ["voucher", params.code],
    queryFn: () => voucherService.getVoucherByCode(params.code || ""),
    enabled: isEditing,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
  if (detailVoucher) {
    form.setFieldsValue({
      ...detailVoucher,
      startDate: dayjs(detailVoucher.startDate),
      endDate: dayjs(detailVoucher.endDate),
    });
  }

  const showConfirm = (values: createVoucherParams, isEditing: boolean) => {
    if (!isEditing) {
      submitVoucher(values);
      return;
    }
    const titleContent = "Apakah anda yakin kamu mengubah data voucher?";
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
        submitVoucher(values);
      },
      onCancel() {
        console.log("Canceled");
      },
    });
  };

  const submitVoucher = (values: createVoucherParams) => {
    if (isEditing) {
      mutateVoucherUpdate({ id: detailVoucher!.id, body: values });
    } else {
      mutateVoucherCreate(values);
    }
  };

  // groupId dpt drmn, status isi apa
  // list slot itu gmn? soalnya abis create catalog, get slot by id, return array kosong
  // udh coba create slot, pas get slot by id, bener return yg baru dibuat td
  // method patch kena cors
  // di list slot blm ada nama
  // di list voucher blm ada kontribusi
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
          <div className="font-semibold text-primary-500">Buat Voucher</div>
          <div className="flex gap-3">
            <img src="/acr-logo.svg" width={20} alt="" /> ACR Digital
          </div>
        </div>
        <div className="p-6 m-6 rounded-md bg-white">
          <div className="flex justify-between">
            <div className="font-semibold text-xl">Buat Voucher</div>
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
                    loading={isPendingUpdateVoucher}
                    disabled={isPendingUpdateVoucher}
                  >
                    Simpan
                  </Button>
                </div>
              ) : null)}
          </div>
          <Divider style={{ margin: 12 }} />
          {loadingDetailVoucher ? (
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
                    label="Kode Voucher"
                    name="code"
                    rules={[{ required: true }]}
                  >
                    <Input
                      disabled={disabledForm}
                      placeholder="Kode Voucher"
                      data-testid="code"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Nama Voucher"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input
                      disabled={disabledForm}
                      placeholder="Nama Voucher"
                      data-testid="name"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Deskripsi" name="description">
                    <Input.TextArea
                      disabled={disabledForm}
                      placeholder="Deskripsi"
                      data-testid="description"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tipe Voucher"
                    name="type"
                    rules={[{ required: true }]}
                  >
                    <Select
                      disabled={disabledForm}
                      options={[
                        { label: "Persentase", value: "percentage" },
                        { label: "Tetap", value: "fixed" },
                      ]}
                      data-testid="type"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item shouldUpdate noStyle>
                    {({ getFieldValue }) => {
                      const isPercentage =
                        getFieldValue("type") === "percentage";
                      return (
                        <Form.Item
                          label="Nilai"
                          name="value"
                          rules={[{ required: true }]}
                        >
                          <Input
                            disabled={disabledForm}
                            placeholder="Nilai"
                            data-testid="value"
                            addonBefore={isPercentage ? undefined : "Rp"}
                            addonAfter={isPercentage ? "%" : undefined}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Jenis Transaksi" name="transactionTypes">
                    <Select
                      mode="multiple"
                      disabled={disabledForm}
                      placeholder="Pilih Jenis Transaksi"
                      options={[
                        {
                          label: "Pembayaran Pertama",
                          value: "INITIAL_PAYMENT",
                        },
                        { label: "Iuran", value: "CONTRIBUTION" },
                      ]}
                      allowClear
                      data-testid="transactionTypes"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Kuota"
                    name="quota"
                    rules={[{ required: true }]}
                  >
                    <Input
                      disabled={disabledForm}
                      placeholder="Kuota"
                      data-testid="quota"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tanggal Mulai"
                    name="startDate"
                    rules={[{ required: true }]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      disabled={disabledForm}
                      data-testid="startDate"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tanggal Berakhir"
                    name="endDate"
                    rules={[{ required: true }]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      disabled={disabledForm}
                      data-testid="endDate"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Aktif"
                    name="isActive"
                    valuePropName="checked"
                  >
                    <Switch disabled={disabledForm} data-testid="isActive" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
        </div>
        <div
          className={`bg-white p-6 rounded-lg flex flex-col ${
            isEditing ? "justify-between sticky" : "justify-end fixed"
          }  gap-3 items-center w-full bottom-0 sticky`}
        >
          {updatedVoucherDetail && (
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
          {!isEditing && (
            <div className="flex justify-between w-full">
              <Button className="w-[200px]" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="primary"
                className="w-[200px]"
                data-testid="submit-down"
                disabled={
                  (isEditing && disabledForm == false) || isPendingUpdateVoucher
                }
                loading={isPendingUpdateVoucher}
                onClick={() => {
                  form.submit();
                }}
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VoucherForm;
