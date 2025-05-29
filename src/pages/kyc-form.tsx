import {
  ArrowLeftOutlined,
  BellFilled,
  FileOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Progress,
  Result,
  Select,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputMatch } from "../components/input-match";
import OCRGuide from "../components/ocr-guide";
import Switch from "../components/switch";
import { getChangedFields } from "../helper/changed-value";
import ProtectedFile from "../helper/protected-file";
import provinceJson from "../helper/province.json";
import useCurrentAddress from "../helper/useCurrentAddress";
import { generalService } from "../services/general.service";
import { kycService } from "../services/kyc.service";

const KYCForm = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const [formKYC1] = Form.useForm();
  const [formKYC2] = Form.useForm();
  const [modalFile, setModalFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [step, setStep] = useState(0);

  const {
    data: kyc,
    isLoading: loadingKyc,
    refetch: refetchKYC,
  } = useQuery({
    queryFn: () => kycService.getKycById(id ?? ""),
    enabled: id !== null,
    queryKey: ["kyc-detail", id],
  });
  // const step = kyc?.statusLevelOne == "APPROVED" ? 2 : 1;

  const { data: kycMatch, isLoading: loadingKycMatch } = useQuery({
    queryFn: () => kycService.getKycByIdMatch(id ?? ""),
    enabled: id !== null,
    queryKey: ["kyc-match", id],
  });

  const { data: banks } = useQuery({
    queryFn: () => generalService.getBanks(),
    queryKey: ["banks"],
  });

  const { mutate: mutateUpdateStatus, isPending: pendingUpdateStatus } =
    useMutation({
      mutationFn: (param: {
        statusLevelOne?: string;
        statusLevelTwo?: string;
      }) => kycService.updateStatusReason(id ?? "", param),
      mutationKey: ["kyc-update-status", id],
      onSuccess: () => {
        notification.success({
          message: "KYC status successfully updated",
        });
        refetchKYC();
      },
    });

  const { mutate: mutateUpdateLevelOne, isPending: pendingUpdateLevelOne } =
    useMutation({
      mutationFn: (param: Record<string, unknown>) =>
        kycService.updateLevelOne(id ?? "", param),
      mutationKey: ["kyc-update-level-one", id],
      onSuccess: (res) => {
        if (!res) {
          notification.success({
            message: "KYC level 1 successfully updated",
          });
          refetchKYC();
        }
      },
    });

  const { mutate: mutateUpdateLevelTwo, isPending: pendingUpdateLevelTwo } =
    useMutation({
      mutationFn: (param: Record<string, unknown>) =>
        kycService.updateLevelTwo(id ?? "", param),
      mutationKey: ["kyc-update-level-two", id],
      onSuccess: (res) => {
        if (!res) {
          notification.success({
            message: "KYC level 2 successfully updated",
          });
          refetchKYC();
        }
      },
    });

  const {
    mutate: mutateSendNotifRejectLevelOne,
    isPending: pendingSendNotifRejectLevelOne,
  } = useMutation({
    mutationFn: () => kycService.sendNotifRejectLevelOne(id ?? ""),
    mutationKey: ["reject-kyc-level-one", id],
    onSuccess: (res) => {
      if (!res) {
        notification.success({ message: "Notifikasi berhasil dikirim" });
      }
    },
  });

  const getBackground = () => {
    if (step == 1) {
      if (kyc?.statusLevelOne === "REJECTED") return "bg-danger-500";
      if (kyc?.statusLevelOne === "IN_PROGRESS") return "bg-warning-500";
      if (kyc?.statusLevelOne === "APPROVED") return "bg-success-500";
    }
    if (step == 2) {
      if (kyc?.statusLevelTwo === "REJECTED") return "bg-danger-500";
      if (kyc?.statusLevelTwo === "IN_PROGRESS") return "bg-warning-500";
      if (kyc?.statusLevelTwo === "APPROVED") return "bg-success-500";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "REJECTED") return "Reject";
    if (status === "IN_PROGRESS") return "Review";
    if (status === "APPROVED") return "Approved";
  };

  const handleSubmit = () => {
    const updateStatusPayload =
      step == 1
        ? {
            statusLevelOne: statusReason,
          }
        : {
            statusLevelTwo: statusReason,
          };

    if (statusReason) {
      mutateUpdateStatus(updateStatusPayload);
    }

    const currentValue =
      step == 1 ? formKYC1.getFieldsValue() : formKYC2.getFieldsValue();
    const changedValue = getChangedFields(kyc, currentValue);

    console.log("currentValue", currentValue);
    console.log("changedValue", changedValue);

    // for some kyc level 2 payload
    if (changedValue?.bank) {
      if (changedValue?.bank?.code) {
        changedValue.bankCode = changedValue.bank?.code;
        delete changedValue.bank?.code;
      }
      if (changedValue?.bank?.number) {
        changedValue.bankAccountNumber = changedValue.bank?.number;
        delete changedValue.bank?.number;
      }
      if (changedValue?.bank?.holderName) {
        changedValue.bankHolderName = changedValue.bank?.holderName;
        delete changedValue.bank?.holderName;
      }
    }
    if (changedValue?.mobile) {
      changedValue.mobileNumber = changedValue.mobile;
      delete changedValue.mobile;
    }

    if (Object.keys(changedValue).length > 0) {
      if (step == 1) {
        mutateUpdateLevelOne(changedValue);
      } else {
        mutateUpdateLevelTwo(changedValue);
      }
    }
  };

  const {
    filteredIdCardCitiesKYC1,
    filteredIdCardDistrictsKYC1,
    selectedIdCardDistrictKYC1,
    filteredDomicileCitiesKYC1,
    filteredDomicileDistrictsKYC1,
    selectedDomicileProvinceKYC1,
    selectedDomicileCityKYC1,
    selectedDomicileDistrictKYC1,
    filteredEmployerCitiesKYC2,
    filteredEmployerDistrictsKYC2,
    selectedEmployerProvinceKYC2,
    selectedEmployerCityKYC2,
    selectedEmployerDistrictKYC2,
  } = useCurrentAddress(Form, formKYC1, formKYC2);

  useEffect(() => {
    setStep(kyc?.statusLevelOne == "APPROVED" ? 2 : 1);
    formKYC1.setFieldsValue(kyc);
    formKYC2.setFieldsValue(kyc);
  }, [kyc, formKYC2, formKYC1]);

  const KYCStep1 = () => {
    return (
      <>
        <Form
          form={formKYC1}
          layout="vertical"
          // className="flex gap-2 w-[70%]"
        >
          <div className="bg-white p-3 mt-2 rounded-lg">
            <div className="font-semibold">
              Identifikasi KTP dan Foto Selfie
            </div>
            <Divider />
            <div className="flex gap-4">
              <div className="flex flex-col border border-solid border-basic-300 rounded-lg w-[50%] p-3">
                <div className="font-semibold">KTP Dokumen</div>
                <div className="flex justify-center w-full">
                  {kyc?.idCardKey ? (
                    <ProtectedFile
                      keyFile={kyc?.idCardKey}
                      type="image"
                      width={200}
                      style={{ objectFit: "contain" }}
                      alt=""
                    />
                  ) : (
                    <div className="italic flex justify-center items-center h-20">
                      No photo provided
                    </div>
                  )}
                </div>
                {/* {kyc.id} */}
                <div className="flex gap-3">
                  <div className="font-semibold">Score Data Anda</div>
                  <Progress
                    percent={parseInt(
                      kycMatch?.statusLevelOnePercentage
                        ? kycMatch?.statusLevelOnePercentage.toFixed(2)
                        : "0"
                    )}
                    strokeWidth={8}
                    //   strokeColor={'orange'}
                    style={{ width: "70%" }}
                  />
                </div>
              </div>
              <div className="flex flex-col border border-solid border-basic-300 rounded-lg w-[50%] p-3">
                <div className="font-semibold">Foto KTP dan Selfie</div>
                <div className="flex justify-center w-full">
                  {kyc?.idCardSelfieKey ? (
                    <ProtectedFile
                      keyFile={kyc?.idCardSelfieKey}
                      type="image"
                      width={200}
                      alt=""
                    />
                  ) : (
                    <div className="italic flex justify-center items-center h-20">
                      No photo provided
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="font-semibold">Score Data Anda</div>
                  <Progress
                    percent={parseInt(
                      kycMatch?.idCardSelfieMatchPercentage
                        ? kycMatch?.idCardSelfieMatchPercentage.toFixed(2)
                        : "0"
                    )}
                    strokeWidth={8}
                    style={{ width: "70%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 mt-2 rounded-lg">
            <div className="font-semibold">Identifikasi dokumen</div>
            <Divider />
            <div className="w-full flex">
              <div className="flex w-full flex-col">
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Item label="NIK" name={["idCardNumber"]} shouldUpdate>
                    <div>
                      <InputMatch
                        label=""
                        value={kyc?.idCardNumber}
                        isMatch={kycMatch?.idCardNumber?.isMatch}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item label="Nama Lengkap" name={["fullName"]}>
                    <div>
                      <InputMatch
                        label=""
                        value={kyc?.fullName}
                        isMatch={kycMatch?.fullName?.isMatch}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item label="Tempat Lahir" name={["placeOfBirth"]}>
                    <div>
                      <InputMatch
                        label=""
                        value={kyc?.placeOfBirth}
                        isMatch={kycMatch?.placeOfBirth?.isMatch}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item label="Tanggal Lahir" name={["dateOfBirth"]}>
                    <div>
                      <InputMatch
                        label=""
                        value={kyc?.dateOfBirth}
                        isMatch={kycMatch?.dateOfBirth?.isMatch}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item label="Jenis Kelamin" name={["gender"]}>
                    <div className="flex items-center gap-3">
                      <Select
                        options={[
                          { value: "Laki-laki", label: "Laki-laki" },
                          { value: "Perempuan", label: "Perempuan" },
                          { value: "Lainnya", label: "Lainnya" },
                        ]}
                        defaultValue={kyc?.gender}
                        disabled={kycMatch?.gender?.isMatch}
                        onChange={(val) => {
                          formKYC1.setFieldValue("gender", val);
                        }}
                      />
                      <Switch value={kycMatch?.gender?.isMatch} />
                    </div>
                  </Form.Item>
                  <Form.Item label="Golongan Darah" name={["bloodGroup"]}>
                    <div className="flex items-center gap-3">
                      <Select
                        options={[
                          { value: "A", label: "A" },
                          { value: "B", label: "B" },
                          { value: "AB", label: "AB" },
                          { value: "O", label: "O" },
                        ]}
                        defaultValue={kyc?.bloodGroup}
                        disabled={kycMatch?.bloodGroup?.isMatch}
                        onChange={(val) => {
                          formKYC1.setFieldValue("bloodGroup", val);
                        }}
                      />
                      <Switch value={kycMatch?.bloodGroup?.isMatch} />
                    </div>
                  </Form.Item>
                  <Form.Item
                    label="Alamat Sesuai KTP"
                    name={["idCardAddress", "line"]}
                  >
                    <div>
                      <InputMatch
                        label=""
                        value={kyc?.idCardAddress?.line}
                        isMatch={kycMatch?.idCardAddress?.line?.isMatch}
                      />
                    </div>
                  </Form.Item>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Item label="RT" name={["idCardAddress", "rtNumber"]}>
                    <div>
                      <InputMatch
                        label=""
                        value={kyc?.idCardAddress?.rtNumber}
                        isMatch={kycMatch?.idCardAddress?.rtNumber?.isMatch}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item label="RW" name={["idCardAddress", "rwNumber"]}>
                    <div>
                      <InputMatch
                        label=""
                        value={kyc?.idCardAddress?.rwNumber}
                        isMatch={kycMatch?.idCardAddress?.rwNumber?.isMatch}
                      />
                    </div>
                  </Form.Item>
                  <div className="flex items-center gap-3 mt-2">
                    <Form.Item
                      label="Provinsi"
                      name={["idCardAddress", "state"]}
                      style={{ width: "100%" }}
                    >
                      <Select
                        optionFilterProp="label"
                        showSearch
                        disabled={kycMatch?.idCardAddress?.state?.isMatch}
                        options={provinceJson}
                      />
                    </Form.Item>
                    <Switch value={kycMatch?.idCardAddress?.state?.isMatch} />
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Form.Item
                      label="Kota"
                      name={["idCardAddress", "city"]}
                      style={{ width: "100%" }}
                    >
                      <Select
                        optionFilterProp="label"
                        showSearch
                        disabled={kycMatch?.idCardAddress?.city?.isMatch}
                        options={filteredIdCardCitiesKYC1}
                      />
                    </Form.Item>
                    <Switch value={kycMatch?.idCardAddress?.city?.isMatch} />
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Form.Item
                      label="Kecamatan"
                      name={["idCardAddress", "district"]}
                      style={{ width: "100%" }}
                    >
                      <Select
                        optionFilterProp="label"
                        showSearch
                        disabled={kycMatch?.idCardAddress?.district?.isMatch}
                        options={filteredIdCardDistrictsKYC1}
                        value={selectedIdCardDistrictKYC1}
                      />
                    </Form.Item>
                    <Switch
                      value={kycMatch?.idCardAddress?.district?.isMatch}
                    />
                  </div>
                  <Form.Item
                    label="Kelurahan"
                    name={["idCardAddress", "subdistrict"]}
                  >
                    <div>
                      <InputMatch
                        label=""
                        value={kyc?.idCardAddress?.subdistrict}
                        isMatch={kycMatch?.idCardAddress?.subdistrict?.isMatch}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item label="Agama" name={["religion"]}>
                    <div className="flex items-center gap-3">
                      <Select
                        options={[
                          { value: "Islam", label: "Islam" },
                          { value: "Kristen", label: "Kristen" },
                          { value: "Katolik", label: "Katolik" },
                          { value: "Hindu", label: "Hindu" },
                          { value: "Budha", label: "Budha" },
                          { value: "Konghucu", label: "Konghucu" },
                          { value: "Lainnya", label: "Lainnya" },
                        ]}
                        defaultValue={kyc?.religion}
                        disabled={kycMatch?.religion?.isMatch}
                        onChange={(val) => {
                          formKYC1.setFieldValue("religion", val);
                        }}
                      />
                      <Switch value={kycMatch?.religion?.isMatch} />
                    </div>
                  </Form.Item>
                  <Form.Item label="Status" name={["maritalStatus"]}>
                    <div className="flex items-center gap-3">
                      <Select
                        options={[
                          { value: "Menikah", label: "Menikah" },
                          { value: "Belum Menikah", label: "Belum Menikah" },
                          { value: "Bercerai", label: "Bercerai" },
                          { value: "Lainnya", label: "Lainnya" },
                        ]}
                        defaultValue={kyc?.maritalStatus}
                        disabled={kycMatch?.maritalStatus?.isMatch}
                        onChange={(val) => {
                          formKYC1.setFieldValue("maritalStatus", val);
                        }}
                      />
                      <Switch value={kycMatch?.maritalStatus?.isMatch} />
                    </div>
                  </Form.Item>
                  <Form.Item label="Pekerjaan" name={["occupation"]}>
                    <div className="flex items-center gap-3">
                      <Select
                        options={[
                          {
                            label: "Pelajar / Mahasiswa",
                            value: "Pelajar / Mahasiswa",
                          },
                          {
                            label: "Pegawai Swasta",
                            value: "Pegawai Swasta",
                          },
                          { label: "PNS / ASN", value: "PNS / ASN" },
                          { label: "Wirausaha", value: "Wirausaha" },
                          {
                            label: "Ibu Rumah Tangga",
                            value: "Ibu Rumah Tangga",
                          },
                          { label: "Tidak Bekerja", value: "Tidak Bekerja" },
                          { label: "Lainnya", value: "Lainnya" },
                        ]}
                        defaultValue={kyc?.occupation}
                        disabled={kycMatch?.occupation?.isMatch}
                        onChange={(val) => {
                          formKYC1.setFieldValue("occupation", val);
                        }}
                      />
                      <Switch value={kycMatch?.occupation?.isMatch} />
                    </div>
                  </Form.Item>
                </div>
              </div>

              <div className="w-[30%] flex items-start justify-center">
                <OCRGuide />
              </div>
            </div>
          </div>
          <div className="bg-white p-3 mt-3 rounded-lg w-full ">
            <div className="flex justify-between items-center mb-4">
              <div className="text-md font-semibold">
                Domisili yang berbeda dengan KTP
              </div>
              <div className="flex gap-3 items-center">
                <span className="font-semibold">Data udah benar?</span>
                <Select
                  placeholder="Pilih status data"
                  options={[
                    {
                      label: "valid",
                      value: 1,
                    },
                    {
                      label: "invalid",
                      value: 2,
                    },
                  ]}
                  className="w-52"
                ></Select>
              </div>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 mb-4">
              <p className="font-medium">Surat Keterangan Domisili</p>
              <div className="flex flex-col items-center justify-center mt-2">
                <FileOutlined className="text-2xl text-gray-500" />
                <p className="text-gray-600 text-sm mt-1">
                  {kyc?.domicileLetterKey}
                </p>
                <div className="flex gap-3">
                  {/* <Button className="mt-2">Upload Ulang</Button> */}
                  <Button
                    type="primary"
                    className="mt-2"
                    onClick={() => {
                      setModalFile(true);
                      setSelectedFile(kyc?.domicileLetterKey ?? "");
                    }}
                  >
                    Lihat File
                  </Button>
                </div>
              </div>
            </div>
            <Alert
              message="Pastikan data anda sesuai dengan surat keterangan domisili"
              type="info"
              showIcon
              style={{ backgroundColor: "#f3e8ff", border: "none" }}
              icon={
                <InfoCircleFilled
                  color="#e195ea"
                  style={{ color: "#602587" }}
                />
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Jalan" name={["domicileAddress", "line"]}>
                <Input />
              </Form.Item>
              <Form.Item label="RT" name={["domicileAddress", "rtNumber"]}>
                <Input />
              </Form.Item>
              <Form.Item label="RW" name={["domicileAddress", "rwNumber"]}>
                <Input />
              </Form.Item>
              <Form.Item label="Provinsi" name={["domicileAddress", "state"]}>
                <Select
                  optionFilterProp="label"
                  showSearch
                  options={provinceJson}
                  value={selectedDomicileProvinceKYC1}
                  onChange={(val) => {
                    formKYC1.setFieldValue(["domicileAddress", "state"], val);
                  }}
                />
              </Form.Item>
              <Form.Item label="Kota" name={["domicileAddress", "city"]}>
                <Select
                  optionFilterProp="label"
                  showSearch
                  options={filteredDomicileCitiesKYC1}
                  value={selectedDomicileCityKYC1}
                />
              </Form.Item>
              <Form.Item
                label="Kecamatan"
                name={["domicileAddress", "district"]}
              >
                <Select
                  optionFilterProp="label"
                  showSearch
                  options={filteredDomicileDistrictsKYC1}
                  value={selectedDomicileDistrictKYC1}
                />
              </Form.Item>
              <Form.Item
                label="Kelurahan"
                name={["domicileAddress", "subdistrict"]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };

  const KYCStep2 = () => {
    return kyc?.statusLevelTwo == null ? (
      <div className="bg-white p-3 mt-3 rounded-lg w-full ">
        <Result
          status="403"
          title="KYC Not Found"
          subTitle="This user doesn't have KYC level 2 yet"
        />
      </div>
    ) : (
      <Form layout="vertical" form={formKYC2}>
        <div className="bg-white p-3 mt-3 rounded-lg w-full ">
          <div className="flex justify-between items-center mb-4">
            <div className="text-md font-semibold">
              Informasi Rekening & Nomor Handphone
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-semibold">Data udah benar?</span>
              <Select
                placeholder="Pilih status data"
                options={[
                  {
                    label: "valid",
                    value: 1,
                  },
                  {
                    label: "invalid",
                    value: 2,
                  },
                ]}
              ></Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Nama Bank" name={["bank", "code"]}>
              <Select
                optionFilterProp="label"
                showSearch
                options={banks?.map((v) => ({
                  label: v.name,
                  value: v.code,
                }))}
              />
            </Form.Item>
            <Form.Item label="Nomor Rekening" name={["bank", "number"]}>
              <Input />
            </Form.Item>
            <Form.Item name={["bank", "holderName"]}>
              <div>
                <InputMatch
                  label="Nama Pemilik Rekening"
                  value={kyc?.bank?.holderName}
                  isMatch={kycMatch?.bank?.holderName.isMatch}
                />
              </div>
            </Form.Item>
            <Form.Item label="Nomor Handphone Anda" name={["mobile"]}>
              <Input />
            </Form.Item>
          </div>
        </div>
        <div className="bg-white p-4 mt-3 rounded-lg w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Informasi Pekerjaan</h2>
            <div className="flex gap-3 items-center">
              <span className="font-semibold">Data udah benar?</span>
              <Select
                placeholder="Pilih status data"
                options={[
                  {
                    label: "valid",
                    value: 1,
                  },
                  {
                    label: "invalid",
                    value: 2,
                  },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Pendidikan Terakhir" name={["highestEducation"]}>
              <Select
                options={[
                  { value: "ELEMENTARY_SCHOOL", label: "SD" },
                  { value: "JUNIOR_HIGH_SCHOOL", label: "SMP" },
                  { value: "SENIOR_HIGH_SCHOOL", label: "SMA" },
                  { value: "DIPLOMA", label: "D3" },
                  { value: "BACHELOR", label: "S1" },
                  { value: "MASTER", label: "S2" },
                  { value: "DOCTORATE", label: "S3" },
                ]}
                onChange={(val) => {
                  formKYC2.setFieldValue("highestEducation", val);
                }}
              />
            </Form.Item>
            <Form.Item label="Pekerjaan" name={["occupation"]}>
              <Select
                options={[
                  {
                    label: "Pelajar / Mahasiswa",
                    value: "Pelajar / Mahasiswa",
                  },
                  {
                    label: "Pegawai Swasta",
                    value: "Pegawai Swasta",
                  },
                  { label: "PNS / ASN", value: "PNS / ASN" },
                  { label: "Wirausaha", value: "Wirausaha" },
                  { label: "Ibu Rumah Tangga", value: "Ibu Rumah Tangga" },
                  { label: "Tidak Bekerja", value: "Tidak Bekerja" },
                  { label: "Lainnya", value: "Lainnya" },
                ]}
                defaultValue={kyc?.occupation}
                disabled={kycMatch?.occupation?.isMatch}
                onChange={(val) => {
                  formKYC2.setFieldValue("occupation", val);
                }}
              />
            </Form.Item>
            <Form.Item label="Posisi" name={["jobTitle"]}>
              <Input />
            </Form.Item>
            <Form.Item label="Penghasilan per Tahun" name={["annualIncome"]}>
              <Select
                options={[
                  { label: "< Rp 10 juta", value: "< Rp 10 juta" },
                  { label: "Rp 10 – 30 juta", value: "Rp 10 – 30 juta" },
                  { label: "Rp 30 – 50 juta", value: "Rp 30 – 50 juta" },
                  { label: "Rp 50 – 100 juta", value: "Rp 50 – 100 juta" },
                  { label: "Rp 100 – 300 juta", value: "Rp 100 – 300 juta" },
                  { label: "Rp 300 – 500 juta", value: "Rp 300 – 500 juta" },
                  {
                    label: "Rp 500 juta – 1 Miliar",
                    value: "Rp 500 juta – 1 Miliar",
                  },
                  { label: "> Rp 1 Miliar", value: "> Rp 1 Miliar" },
                ]}
                onChange={(val) => {
                  formKYC2.setFieldValue("annualIncome", val);
                }}
              />
            </Form.Item>
            <Form.Item label="Nama Perusahaan" name={["employerName"]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Alamat Perusahaan"
              name={["employerAddress", "line"]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="RT" name={["employerAddress", "rtNumber"]}>
              <Input />
            </Form.Item>
            <Form.Item label="RW" name={["employerAddress", "rwNumber"]}>
              <Input />
            </Form.Item>
            <Form.Item label="Provinsi" name={["employerAddress", "state"]}>
              <Select
                optionFilterProp="label"
                showSearch
                options={provinceJson}
                value={selectedEmployerProvinceKYC2}
              />
            </Form.Item>
            <Form.Item label="Kota" name={["employerAddress", "city"]}>
              <Select
                optionFilterProp="label"
                showSearch
                options={filteredEmployerCitiesKYC2}
                value={selectedEmployerCityKYC2}
              />
            </Form.Item>
            <Form.Item label="Kecamatan" name={["employerAddress", "district"]}>
              <Select
                optionFilterProp="label"
                showSearch
                options={filteredEmployerDistrictsKYC2}
                value={selectedEmployerDistrictKYC2}
              />
            </Form.Item>
            <Form.Item
              label="Kelurahan"
              name={["employerAddress", "subdistrict"]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nomor Handphone Perusahaan"
              name={["employerMobile"]}
            >
              <Input />
            </Form.Item>
          </div>
        </div>
        <div className="bg-white p-4 mt-3 rounded-lg w-full">
          <div className="font-semibold text-lg">Family Card Document</div>
          <div className="flex flex-col items-center justify-center mt-2">
            <FileOutlined className="text-2xl text-gray-500" />
            <p className="text-gray-600 text-sm mt-1">{kyc?.familyCardKey}</p>
            <div className="flex gap-3">
              {/* <Button className="mt-2">Upload Ulang</Button> */}
              <Button
                type="primary"
                className="mt-2"
                onClick={() => {
                  setModalFile(true);
                  setSelectedFile(kyc.familyCardKey ?? "");
                }}
              >
                Lihat File
              </Button>
            </div>
          </div>
        </div>
      </Form>
    );
  };

  if (loadingKyc || loadingKycMatch) {
    return (
      <>
        <div className="w-full flex justify-between p-3 text-primary-500 font-semibold bg-white">
          <div
            className="flex gap-3 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftOutlined /> Process Detail
          </div>
          <div>Langkah {step} dari 2</div>
          <div className="flex gap-3">
            <img src="/acr-logo.svg" width={20} alt="" /> ACR Digital
          </div>
        </div>
        <div className="w-full h-[calc(100vh-100px)] grid place-content-center">
          <Spin tip="Loading..." />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full flex justify-between p-3 text-primary-500 font-semibold bg-white">
        <div className="flex gap-3 cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeftOutlined /> Process Detail
        </div>
        <div>Langkah {step} dari 2</div>
        <div className="flex gap-3">
          <img src="/acr-logo.svg" width={20} alt="" /> ACR Digital
        </div>
      </div>
      <div className="w-full p-3 bg-basic-100">
        {/* <Tabs items={[{label:'kyc 1',children:}]} /> */}
        <div className="w-full flex items-center justify-center gap-2 bg-white p-2 mb-3 rounded-lg">
          <Button
            type={step == 1 ? "primary" : "default"}
            block
            onClick={() => setStep(1)}
          >
            KYC Tahap 1
          </Button>
          <Button
            type={step == 2 ? "primary" : "default"}
            block
            onClick={() => setStep(2)}
          >
            KYC Tahap 2
          </Button>
        </div>
        <div className={`${getBackground()} rounded-lg`}>
          <div className="bg-white flex justify-between rounded-lg p-3">
            <div>
              <div className="font-bold">{kyc?.fullName}</div>
              <div className="font-semibold">
                Perubahan terakhir: {dayjs(kyc?.updatedAt).format("DD-MM-YYYY")}{" "}
                | {dayjs(kyc?.updatedAt).format("HH:mm A")}
              </div>
            </div>
            <div className="bg-primary-300 rounded-xl p-2 flex gap-3 items-center">
              <div className="rounded-full bg-white flex justify-center items-center p-2">
                <BellFilled />
              </div>
              <div className="text-white font-semibold">
                Kirim pemberitahuan kepada user
              </div>
              <Popconfirm
                title="Yakin ingin mengirim notifikasi ke user ini?"
                onConfirm={() => {
                  console.log("mutate reject!");
                  mutateSendNotifRejectLevelOne();
                }}
                placement="left"
              >
                <button
                  className="bg-primary-500 rounded-lg flex items-center px-2 text-white cursor-pointer hover:bg-primary-500/70"
                  // onClick={() => {
                  //   Popconfirm({});
                  // }}
                >
                  {pendingSendNotifRejectLevelOne
                    ? "Sending..."
                    : "Kirim Notifikasi"}
                </button>
              </Popconfirm>
            </div>
          </div>
          <div
            className={`${getBackground()} flex justify-center text-white font-semibold rounded-lg py-1`}
          >
            Status{" "}
            {step == 1
              ? getStatusLabel(kyc?.statusLevelOne ?? "")
              : getStatusLabel(kyc?.statusLevelTwo ?? "")}
          </div>
        </div>

        {step == 1 ? <KYCStep1 /> : <KYCStep2 />}

        <div className="bg-white p-4 rounded-lg flex justify-between items-center w-full sticky bottom-0 mt-3">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Pilih Respon Status</label>
            <Select
              defaultValue={
                step == 1 ? kyc?.statusLevelOne : kyc?.statusLevelTwo
              }
              key={step}
              options={[
                { label: "Sedang Berjalan", value: "IN_PROGRESS" },
                { label: "Sedang Ditinjau", value: "IN_REVIEW" },
                { label: "Ditolak", value: "REJECTED" },
                { label: "Disetujui", value: "APPROVED" },
              ]}
              className="w-48"
              onChange={(v) => setStatusReason(v)}
            />
          </div>
          <Button
            type="primary"
            loading={
              pendingUpdateStatus ||
              pendingUpdateLevelOne ||
              pendingUpdateLevelTwo
            }
            disabled={
              pendingUpdateStatus ||
              pendingUpdateLevelOne ||
              pendingUpdateLevelTwo ||
              (step == 2 && kyc?.statusLevelTwo == null)
            }
            onClick={() => handleSubmit()}
            className="bg-purple-600 text-white px-6 py-2 rounded-full"
          >
            Submit
          </Button>
        </div>
      </div>
      <Modal
        open={modalFile}
        onCancel={() => setModalFile(false)}
        footer={null}
        centered
        title="Detail Document"
      >
        <div className="flex justify-center items-center h-full">
          {selectedFile ? (
            <ProtectedFile
              keyFile={selectedFile}
              style={{ width: 700, height: 600 }}
              type="file"
            />
          ) : (
            <Result
              status="403"
              title="File Not Found"
              subTitle="This file doesn't exist"
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default KYCForm;
