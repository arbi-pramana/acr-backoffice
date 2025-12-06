import { ArrowLeftOutlined, InfoCircleFilled } from "@ant-design/icons";
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
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { constants } from "../helper/constant";
import { accountService } from "../services/account.service";
import { kloterService } from "../services/kloter.service";
import { slotService } from "../services/slot.service";
import { userSlotReplacementService } from "../services/user-slot-replacement.service";
import {
  createUserSlotReplacementParams,
  updateUserSlotReplacementByIdParams,
} from "../types";

const UserSlotReplacementForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.id);
  const isEditing = params.id !== undefined;
  const [form] = Form.useForm();
  const [catalogId, setCatalogId] = useState<number | null>(null);
  const [disabledForm, setDisabledForm] = useState(isEditing);
  const [
    updatedUserSlotReplacementDetail,
    setUpdatedUserSlotReplacementDetail,
  ] = useState(false);
  const queryClient = useQueryClient();

  const { data: catalogOptions } = useQuery({
    queryKey: ["catalogOptions"],
    queryFn: () => kloterService.getAllKloters(),
    select: (data) =>
      data.map((catalog) => ({
        label: catalog.title,
        value: catalog.id,
      })),
  });

  const { data: userOptions } = useQuery({
    queryKey: ["userOptions"],
    queryFn: () => accountService.getAllAccounts(),
    select: (data) =>
      data.map((user) => ({
        label: `${user.email}`,
        value: user.id,
      })),
  });

  const { data: slotOptions } = useQuery({
    queryKey: ["allSlots"],
    queryFn: () => slotService.getSlotByCatalogId(catalogId!),
    enabled: !!catalogId,
  });

  const { mutate: mutateUserSlotReplacementCreate } = useMutation({
    mutationKey: ["createUserSlotReplacement"],
    mutationFn: (body: createUserSlotReplacementParams) => {
      
      return userSlotReplacementService.createUserSlotReplacement(body);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["userSlotReplacements"] });
        notification.success({
          message: "User slot replacement berhasil dibuat.",
        });
        navigate(`/dashboard?tab=userSlotReplacement`);
      }
    },
  });

  const {
    mutate: mutateUserSlotReplacementUpdate,
    isPending: isPendingUpdateUserSlotReplacement,
  } = useMutation({
    mutationKey: ["updateUserSlotReplacement"],
    mutationFn: (data: updateUserSlotReplacementByIdParams) => {
      console.log("update userSlotReplacement", { data });
      return userSlotReplacementService.updateUserSlotReplacementById(data);
    },
    onSuccess: (data, variables) => {
      // error response
      if (data.status && data.status.toString().startsWith("5")) {
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ["userSlotReplacement", params.code],
      });
      setDisabledForm(true);

      notification.success({
        message: "User slot replacement berhasil diubah.",
      });

      // mean that we update the userSlotReplacement detail
      if (
        Object.keys(variables.body).length > 1 &&
        "status" in variables.body
      ) {
        setUpdatedUserSlotReplacementDetail(true);
      } else {
        setUpdatedUserSlotReplacementDetail(false);
      }
    },
  });

  const {
    data: detailUserSlotReplacement,
    isLoading: loadingDetailUserSlotReplacement,
  } = useQuery({
    queryKey: ["userSlotReplacement", params.code],
    queryFn: () => userSlotReplacementService.getUserSlotReplacementById(id),
    enabled: isEditing,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
  if (detailUserSlotReplacement) {
    form.setFieldsValue({
      ...detailUserSlotReplacement,
    });
  }

  const slotId = Form.useWatch("slotId", form);
  const selectedSlot = useMemo(() => {
    return slotOptions?.find((slot) => slot.id === slotId);
  }, [slotId, slotOptions]);

  useEffect(() => {
    form.setFieldsValue({
      oldUserId: selectedSlot?.userId,
    });
  }, [selectedSlot, form]);

  const showConfirm = (
    values: createUserSlotReplacementParams,
    isEditing: boolean
  ) => {
    if (!isEditing) {
      submitUserSlotReplacement(values);
      return;
    }
    const titleContent =
      "Apakah anda yakin kamu mengubah data userSlotReplacement?";
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
        submitUserSlotReplacement(values);
      },
      onCancel() {
      },
    });
  };

  const submitUserSlotReplacement = (
    values: createUserSlotReplacementParams
  ) => {
    if (isEditing) {
      mutateUserSlotReplacementUpdate({
        id: detailUserSlotReplacement!.id,
        body: values,
      });
    } else {
      mutateUserSlotReplacementCreate(values);
    }
  };

  // groupId dpt drmn, status isi apa
  // list slot itu gmn? soalnya abis create catalog, get slot by id, return array kosong
  // udh coba create slot, pas get slot by id, bener return yg baru dibuat td
  // method patch kena cors
  // di list slot blm ada nama
  // di list userSlotReplacement blm ada kontribusi
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
          <div className="font-semibold text-primary-500">
            User Slot Replacement
          </div>
          <div className="flex gap-3">
            <img src="/acr-logo.svg" width={20} alt="" /> ACR Digital
          </div>
        </div>
        <div className="p-6 m-6 rounded-md bg-white">
          <div className="flex justify-between">
            <div className="font-semibold text-xl">User Slot Replacement</div>
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
                    loading={isPendingUpdateUserSlotReplacement}
                    disabled={isPendingUpdateUserSlotReplacement}
                  >
                    Simpan
                  </Button>
                </div>
              ) : null)}
          </div>
          <Divider style={{ margin: 12 }} />
          {loadingDetailUserSlotReplacement ? (
            <div className="flex justify-center">
              <Spin size="default" />
            </div>
          ) : (
            <Form
              layout="vertical"
              form={form}
              onFinish={(values) => showConfirm(values, isEditing)}
              onFinishFailed={(err) =>
                notification.error({
                  message: "Form submission failed",
                  description:
                    err?.errorFields?.[0]?.errors?.[0] ||
                    "Please check the form for errors and try again.",
                })
              }
            >
              <Row gutter={16}>
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
                        ((option?.label as string) ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={catalogOptions}
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
                <Col span={12}>
                  <Form.Item
                    label="User Sebelumnya"
                    name="oldUserId"
                    rules={[{ required: true }]}
                  >
                    <Select
                      disabled={disabledForm}
                      placeholder="Pilih User Lama"
                      data-testid="oldUserId"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        ((option?.label as string) ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={userOptions}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="User Baru"
                    name="newUserId"
                    rules={[{ required: true }]}
                  >
                    <Select
                      disabled={disabledForm}
                      placeholder="Pilih User Baru"
                      data-testid="newUserId"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        ((option?.label as string) ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={userOptions}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Form.Item
                      label="Biaya"
                      name="fee"
                      rules={[{ required: true }]}
                    >
                      <Input
                        disabled={disabledForm}
                        placeholder="Biaya"
                        data-testid="fee"
                        addonBefore={"Rp"}
                      />
                    </Form.Item>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Deskripsi" name="description">
                    <Input.TextArea
                      autoSize={{ minRows: 1, maxRows: 10 }}
                      disabled={disabledForm}
                      placeholder="Deskripsi"
                      data-testid="description"
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
          }  gap-3 items-center w-full bottom-0`}
        >
          {updatedUserSlotReplacementDetail && (
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
                  (isEditing && !disabledForm) ||
                  isPendingUpdateUserSlotReplacement
                }
                loading={isPendingUpdateUserSlotReplacement}
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

export default UserSlotReplacementForm;
