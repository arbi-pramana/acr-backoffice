import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { constants } from "../helper/constant";
import { invoiceGetService } from "../services/invoice-get.service";
import { kloterService } from "../services/kloter.service";
import { slotService } from "../services/slot.service";
import { createInvoiceGetParams, updateInvoiceGetByIdParams } from "../types";

const InvoiceGetForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const invoiceGetId = params.uuid;
  const isEditing = params.uuid !== undefined;
  const [catalogId, setCatalogId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [disabledForm, setDisabledForm] = useState(isEditing);
  const [, setUpdatedInvoiceGetDetail] = useState(false);
  const queryClient = useQueryClient();

  const invoiceTypes = [
    {
      value: "GET_DEDUCTION",
      label: "Get Deduction",
    },
    {
      value: "FINAL_DEDUCTION",
      label: "Final Deduction",
    },
    {
      value: "FINAL_DEPOSIT",
      label: "Final Deposit",
    },
  ];

  const statusOptions = [
    {
      value: "PENDING",
      label: "Pending",
    },
    {
      value: "COMPLETED",
      label: "Completed",
    },
    {
      value: "FAILED",
      label: "Failed",
    },
  ];

  const { data: kloterOptions } = useQuery({
    queryKey: ["allKloters"],
    queryFn: () => kloterService.getAllKloters(),
  });

  const { data: slotOptions } = useQuery({
    queryKey: ["allSlots"],
    queryFn: () => slotService.getSlotByCatalogId(catalogId!),
    enabled: !!catalogId,
  });

  const { mutate: mutateInvoiceGetCreate } = useMutation({
    mutationKey: ["createInvoiceGet"],
    mutationFn: (body: createInvoiceGetParams) =>
      invoiceGetService.createInvoiceGet(body),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["invoiceGets"] });
        notification.success({
          message: "InvoiceGet berhasil dibuat.",
        });
        navigate(`/dashboard?tab=invoiceGet`);
      }
    },
  });

  const {
    mutate: mutateInvoiceGetUpdate,
    isPending: isPendingUpdateInvoiceGet,
  } = useMutation({
    mutationKey: ["updateInvoiceGet"],
    mutationFn: (data: updateInvoiceGetByIdParams) =>
      invoiceGetService.updateInvoiceGetById(data),
    onSuccess: (data, variables) => {
      // error response
      if (data.status && data.status.toString().startsWith("5")) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["invoiceGet", invoiceGetId] });
      setDisabledForm(true);
      console.log("update invoiceGet", variables);

      notification.success({
        message: "InvoiceGet berhasil diupdate.",
      });

      // mean that we update the invoiceGet detail
      if (
        Object.keys(variables.body).length > 1 &&
        "status" in variables.body
      ) {
        setUpdatedInvoiceGetDetail(true);
      } else {
        setUpdatedInvoiceGetDetail(false);
      }
    },
  });

  const {
    data: detailInvoiceGet,
    isLoading: loadingDetailInvoiceGet,
    // isFetching: fetchingDetailInvoiceGet,
  } = useQuery({
    queryKey: ["invoiceGet", invoiceGetId],
    queryFn: () => invoiceGetService.getInvoiceGetByUuid(invoiceGetId!),
    enabled: isEditing,
    staleTime: 1000 * 60 * 3, // 3 minutes,
  });

  useEffect(() => {
    if (detailInvoiceGet) {
      form.setFieldsValue({
        ...detailInvoiceGet,
      });
      setCatalogId(detailInvoiceGet.catalogId);
    }
  }, [detailInvoiceGet, form]);

  useEffect(() => {
    if (!isEditing) {
      form.setFieldValue("status", "PENDING");
    } else {
      form.setFieldValue("status", detailInvoiceGet?.status);
    }
  }, [isEditing, form, detailInvoiceGet]);

  const showConfirm = (values: createInvoiceGetParams, isEditing: boolean) => {
    if (!isEditing) {
      submitInvoiceGet(values);
      return;
    }
    const titleContent = "Apakah anda yakin kamu mengubah data invoiceGet?";
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
        submitInvoiceGet(values);
      },
      onCancel() {
        console.log("Canceled");
      },
    });
  };

  const submitInvoiceGet = (values: createInvoiceGetParams) => {
    if (isEditing) {
      if (!detailInvoiceGet) {
        notification.error({
          message: "Gagal mengubah invoice",
          description: "Data invoice tidak ditemukan.",
        });
        return;
      }

      mutateInvoiceGetUpdate({
        id: detailInvoiceGet.id,
        body: { ...values, uuid: detailInvoiceGet.uuid },
      });
    } else {
      mutateInvoiceGetCreate({ ...values, uuid: uuidv4() });
    }
  };

  const typeValue = Form.useWatch("type", form);

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
          <div className="font-semibold text-primary-500">Buat Invoice Get</div>
          <div className="flex gap-3">
            <img src="/acr-logo.svg" width={20} alt="" /> ACR Digital
          </div>
        </div>
        <div className="p-6 m-6 rounded-md bg-white">
          <div className="flex justify-between">
            <div className="font-semibold text-xl">Buat Invoice Get</div>
            {isEditing &&
              (disabledForm ? (
                <Button
                  type="primary"
                  onClick={() => setDisabledForm(!disabledForm)}
                >
                  Edit
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button onClick={() => setDisabledForm(true)}>Cancel</Button>
                  <Button
                    type="primary"
                    onClick={() => form.submit()}
                    loading={isPendingUpdateInvoiceGet}
                    disabled={isPendingUpdateInvoiceGet}
                  >
                    Simpan
                  </Button>
                </div>
              ))}
          </div>
          <Divider style={{ margin: 12 }} />
          {loadingDetailInvoiceGet ? (
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
                    label="Number"
                    name="number"
                    rules={[{ required: true }]}
                  >
                    <Input
                      disabled={disabledForm}
                      placeholder="Number"
                      data-testid="number"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true }]}
                  >
                    <Input
                      disabled={disabledForm}
                      placeholder="Description"
                      data-testid="description"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Kloter"
                    name="catalogId"
                    rules={[{ required: true }]}
                  >
                    <Select
                      disabled={disabledForm}
                      placeholder="Pilih Kloter"
                      data-testid="catalogId"
                      showSearch
                      optionFilterProp="children"
                      onChange={(value) => {
                        setCatalogId(value);
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={kloterOptions?.map((kloter) => ({
                        value: kloter.id,
                        label: kloter.title + " (" + kloter.groupId + ")",
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Slot"
                    name="slotId"
                    rules={[{ required: true }]}
                  >
                    <Select
                      disabled={disabledForm}
                      placeholder="Pilih Slot"
                      data-testid="slotId"
                      showSearch
                      optionFilterProp="children"
                      options={slotOptions
                        ?.map((slot, i) => ({
                          ...slot,
                          no: i + 1,
                        }))
                        ?.filter((slot) => slot.userId)
                        ?.map((slot) => ({
                          value: slot.id,
                          label: `${slot.no}. ${slot.name}`,
                        }))}
                    />
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                  <Form.Item
                    label="Transaction ID"
                    name="transactionId"
                    rules={[{ required: true }]}
                  >
                    <Input
                      type="number"
                      disabled={disabledForm}
                      placeholder="Transaction ID"
                      data-testid="transactionId"
                    />
                  </Form.Item>
                </Col> */}
                <Col span={12}>
                  <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true }]}
                  >
                    <Select
                      disabled={disabledForm}
                      placeholder="Pilih Type"
                      data-testid="type"
                      options={invoiceTypes}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true }]}
                  >
                    <Input
                      type="number"
                      disabled={disabledForm || typeValue !== "GET_DEDUCTION"}
                      placeholder="Amount"
                      data-testid="amount"
                      addonBefore="Rp"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true }]}
                  >
                    <Select
                      disabled={true}
                      placeholder="Pilih Status"
                      data-testid="status"
                      options={statusOptions}
                    />
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
          {/* {updatedInvoiceGetDetail && (
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
          )} */}
          {!isEditing && (
            <div className="flex justify-between w-full">
              <Button className="w-[200px]" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="primary"
                className="w-[200px]"
                data-testid="submit-down"
                disabled={isPendingUpdateInvoiceGet}
                loading={isPendingUpdateInvoiceGet}
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

export default InvoiceGetForm;
