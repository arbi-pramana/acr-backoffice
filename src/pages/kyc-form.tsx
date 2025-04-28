import {
  ArrowLeftOutlined,
  BellFilled,
  FileOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Progress,
  Select,
  Spin,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OCRGuide from "../components/ocr-guide";
import Switch from "../components/switch";
import ProtectedFile from "../helper/protected-file";
import { kycService } from "../services/kyc.service";

const KYCStep1 = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  console.log("params", params);
  const [form] = Form.useForm();
  const [modalFile, setModalFile] = useState(false);
  const [statusReason, setStatusReason] = useState("");
  const queryClient = useQueryClient();

  const { data: kyc, isLoading: loadingKyc } = useQuery({
    queryFn: () => kycService.getKycById(id ?? ""),
    enabled: id !== null,
    queryKey: ["kyc", id],
  });
  const step = kyc?.statusLevelOne == "APPROVED" ? 2 : 1;

  const { data: kycMatch } = useQuery({
    queryFn: () => kycService.getKycByIdMatch(id ?? ""),
    enabled: id !== null,
    queryKey: ["kyc-match", id],
  });
  const { mutate: mutateUpdateStatus, isPending: pendingUpdateStatus } =
    useMutation({
      mutationFn: (param: { statusLevelOne: string }) =>
        kycService.updateStatusReason(id ?? "", param),
      mutationKey: ["kyc-update-status", id],
      onSuccess: () => {
        // queryClient.invalidateQueries(["kyc-match", "kyc"]);
        notification.success({
          message: "KYC successfully updated",
        });
        navigate(-1);
        queryClient.invalidateQueries({ queryKey: ["kyc-match", "kyc", id] });
        // refetchKyc();
        // refetchKycMatch();
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

  const InputMatch = ({
    value,
    isMatch = false,
    label,
  }: {
    label: string;
    value?: string;
    isMatch?: boolean;
  }) => {
    return (
      <>
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-3">
          <Input defaultValue={value} className="w-full" disabled={isMatch} />
          <Switch value={isMatch} />
        </div>
      </>
    );
  };

  if (loadingKyc) {
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
        <div className="w-full flex items-center justify-center gap-2">
          <Progress
            percent={100}
            showInfo={false}
            strokeWidth={8}
            strokeColor={{
              "0%": "#2D0C46",
              "100%": "#B144F5",
            }}
            trailColor="#E5E5E5"
            style={{ width: "50%" }}
          />
          <Progress
            percent={step == 2 ? 100 : 0}
            showInfo={false}
            strokeWidth={8}
            strokeColor={{
              "0%": "#2D0C46",
              "100%": "#B144F5",
            }}
            trailColor="#E5E5E5"
            style={{ width: "50%" }}
          />
        </div>
        <div className={`${getBackground()} rounded-lg`}>
          <div className="bg-white flex justify-between rounded-lg p-3">
            <div>
              <div className="font-bold">{kyc?.fullName}</div>
              <div className="font-semibold">
                Last submitted: DATE?? | TIME??
              </div>
            </div>
            <div className="bg-primary-300 rounded-xl p-2 flex gap-3 items-center">
              <div className="rounded-full bg-white flex justify-center items-center p-2">
                <BellFilled />
              </div>
              <div className="text-white font-semibold">
                Kirim pemberitahuan kepada user
              </div>
              <button className="bg-primary-500 rounded-lg flex items-center px-2 text-white">
                Send Notification
              </button>
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
        {step == 1 ? (
          <>
            <div className="bg-white p-3 mt-2 rounded-lg">
              <div className="font-semibold">
                Identifikasi KTP dan Foto Selfie
              </div>
              <Divider />
              <div className="flex gap-4">
                <div className="flex flex-col border border-solid border-basic-300 rounded-lg w-[50%] p-3">
                  <div className="font-semibold">KTP Dokumen</div>
                  <div className="flex justify-center w-full">
                    {/* <img src="/acr-logo.svg" width={200} alt="" /> */}
                    <ProtectedFile
                      keyFile={kyc?.idCardKey}
                      type="image"
                      width={200}
                      style={{ objectFit: "contain" }}
                      alt=""
                    />
                  </div>
                  {/* {kyc.id} */}
                  <div className="flex gap-3">
                    <div className="font-semibold">Score Data Anda</div>
                    <Progress
                      percent={kycMatch?.idCardMatchPercentage}
                      strokeWidth={8}
                      //   strokeColor={'orange'}
                      style={{ width: "70%" }}
                    />
                  </div>
                </div>
                <div className="flex flex-col border border-solid border-basic-300 rounded-lg w-[50%] p-3">
                  <div className="font-semibold">Foto KTP dan Selfie</div>
                  <div className="flex justify-center w-full">
                    {/* <img src="/acr-logo.svg" width={200} alt="" /> */}
                    <ProtectedFile
                      keyFile={kyc?.idCardKey}
                      type="image"
                      width={200}
                      alt=""
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="font-semibold">Score Data Anda</div>
                    <Progress
                      percent={kycMatch?.idCardSelfieMatchPercentage}
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
                <Form
                  form={form}
                  layout="vertical"
                  className="flex gap-2 w-[70%]"
                >
                  <div className="flex w-full flex-col">
                    <div className="grid grid-cols-2 gap-x-4">
                      <Form.Item label="NIK">
                        <InputMatch
                          label=""
                          value={kyc?.idCardNumber}
                          isMatch={kycMatch?.idCardNumber?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Nama Lengkap">
                        <InputMatch
                          label=""
                          value={kyc?.fullName}
                          isMatch={kycMatch?.fullName?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Tempat Lahir">
                        <InputMatch
                          label=""
                          value={kyc?.placeOfBirth}
                          isMatch={kycMatch?.placeOfBirth?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Tanggal Lahir">
                        <InputMatch
                          label=""
                          value={kyc?.dateOfBirth}
                          isMatch={kycMatch?.dateOfBirth?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Jenis Kelamin">
                        <InputMatch
                          label=""
                          value={kyc?.gender}
                          isMatch={kycMatch?.gender?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Golongan Darah">
                        <InputMatch
                          label=""
                          value={kyc?.bloodGroup}
                          isMatch={kycMatch?.bloodGroup?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Alamat Sesuai KTP">
                        <InputMatch
                          label=""
                          value={kyc?.idCardAddress?.line}
                          isMatch={kycMatch?.idCardAddress?.line?.isMatch}
                        />
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4">
                      <Form.Item label="RT">
                        <InputMatch
                          label=""
                          value={kyc?.idCardAddress?.rtNumber}
                          isMatch={kycMatch?.idCardAddress?.rtNumber?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="RW">
                        <InputMatch
                          label=""
                          value={kyc?.idCardAddress?.rwNumber}
                          isMatch={kycMatch?.idCardAddress?.rwNumber?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Provinsi">
                        <InputMatch
                          label=""
                          value={kyc?.idCardAddress?.state}
                          isMatch={kycMatch?.idCardAddress?.state?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Kota">
                        <InputMatch
                          label=""
                          value={kyc?.idCardAddress?.city}
                          isMatch={kycMatch?.idCardAddress?.city?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Kecamatan">
                        <InputMatch
                          label=""
                          value={kyc?.idCardAddress?.district}
                          isMatch={kycMatch?.idCardAddress?.district?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Kelurahan">
                        <InputMatch
                          label=""
                          value={kyc?.idCardAddress?.subdistrict}
                          isMatch={
                            kycMatch?.idCardAddress?.subdistrict?.isMatch
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Agama">
                        <InputMatch
                          label=""
                          value={kyc?.religion}
                          isMatch={kycMatch?.religion?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Status">
                        <InputMatch
                          label=""
                          value={kyc?.maritalStatus}
                          isMatch={kycMatch?.maritalStatus?.isMatch}
                        />
                      </Form.Item>
                      <Form.Item label="Pekerjaan">
                        <InputMatch
                          label=""
                          value={kyc?.occupation}
                          isMatch={kycMatch?.occupation?.isMatch}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </Form>
                <div className="w-[30%] flex items-start justify-center">
                  <OCRGuide />
                </div>
              </div>
            </div>
            <div className="bg-white p-3 mt-3 rounded-lg w-full ">
              {/* Header */}
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

              {/* File Upload Section */}
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
                      onClick={() => setModalFile(true)}
                    >
                      Lihat File
                    </Button>
                  </div>
                </div>
              </div>

              {/* Alert */}
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

              {/* Address Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium">Jalan</label>
                  <Input defaultValue={kyc?.idCardAddress?.line} />
                </div>

                <div>
                  <label className="text-sm font-medium">RT</label>
                  <Input defaultValue={kyc?.idCardAddress?.rtNumber} />
                </div>
                <div>
                  <label className="text-sm font-medium">RW</label>
                  <Input defaultValue={kyc?.idCardAddress?.rwNumber} />
                </div>

                <div>
                  <label className="text-sm font-medium">Provinsi</label>
                  <Input defaultValue={kyc?.idCardAddress?.state} />
                </div>

                <div>
                  <label className="text-sm font-medium">Kota</label>
                  <Input defaultValue={kyc?.idCardAddress?.city} />
                </div>

                <div>
                  <label className="text-sm font-medium">Kecamatan</label>
                  <Input defaultValue={kyc?.idCardAddress?.district} />
                </div>

                <div>
                  <label className="text-sm font-medium">Kelurahan</label>
                  <Input defaultValue={kyc?.idCardAddress?.subdistrict} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
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
                <div>
                  <InputMatch
                    label="Nama Pemilik Rekening"
                    value={kyc?.bank.code}
                    isMatch={false}
                  />
                  compare??
                </div>
                <div>
                  <InputMatch
                    label="Nama Pemilik Rekening"
                    value={kyc?.bank.number}
                    isMatch={false}
                  />
                  compare??
                </div>

                <div>
                  <InputMatch
                    label="Nama Pemilik Rekening"
                    value={kyc?.bank.holderName}
                    isMatch={false}
                  />
                  compare??
                </div>

                <div>
                  <InputMatch
                    label="Nama Pemilik Rekening"
                    value={kyc?.mobile}
                    isMatch={false}
                  />
                  compare??
                </div>
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

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                {/* Pendidikan Terakhir */}
                <div>
                  <InputMatch
                    label="Pendidikan Terakhir"
                    value={kyc?.highestEducation}
                    isMatch={false}
                  />
                  compare??
                </div>

                {/* Pekerjaan */}
                <div>
                  <InputMatch
                    label="Pekerjaan"
                    value={kyc?.occupation}
                    isMatch={kycMatch?.occupation.isMatch}
                  />
                </div>

                {/* Posisi */}
                <div>
                  <InputMatch
                    label="Posisi"
                    value={kyc?.jobTitle}
                    isMatch={false}
                  />
                  compare??
                </div>

                {/* Penghasilan per Tahun */}
                <div>
                  <InputMatch
                    label="Penghasilan per Tahun"
                    value={kyc?.annualIncome}
                    isMatch={false}
                  />
                  compare??
                </div>

                {/* Nama Perusahaan */}
                <div>
                  <InputMatch
                    label="Nama Perusahaan"
                    value={kyc?.employerName}
                    isMatch={false}
                  />
                  compare??
                </div>

                {/* Alamat Perusahaan */}
                <div>
                  <InputMatch
                    label="Alamat Perusahaan"
                    value={kyc?.employerName}
                    isMatch={false}
                  />
                  compare??
                </div>

                {/* RT & RW */}
                <div>
                  <InputMatch
                    label="RT"
                    value={kyc?.idCardAddress.rtNumber}
                    isMatch={kycMatch?.idCardAddress.rtNumber.isMatch}
                  />
                </div>
                <div>
                  <InputMatch
                    label="RW"
                    value={kyc?.idCardAddress.rwNumber}
                    isMatch={kycMatch?.idCardAddress.rwNumber.isMatch}
                  />
                </div>

                {/* Provinsi & Kota */}
                <div>
                  <InputMatch
                    label="Provinsi"
                    value={kyc?.idCardAddress.state}
                    isMatch={kycMatch?.idCardAddress.state.isMatch}
                  />
                </div>

                <div>
                  <InputMatch
                    label="Kota"
                    value={kyc?.idCardAddress.city}
                    isMatch={kycMatch?.idCardAddress.city.isMatch}
                  />
                </div>

                {/* Kecamatan & Kelurahan */}
                <div>
                  <InputMatch
                    label="Kecamatan"
                    value={kyc?.idCardAddress.district}
                    isMatch={kycMatch?.idCardAddress.district.isMatch}
                  />
                </div>

                <div>
                  <InputMatch
                    label="Kelurahan"
                    value={kyc?.idCardAddress.subdistrict}
                    isMatch={kycMatch?.idCardAddress.subdistrict.isMatch}
                  />
                </div>
                <div>
                  <InputMatch
                    label="Nomor Handphone Perusahaan"
                    value={kyc?.employerMobile}
                    isMatch={false}
                  />
                  compare??
                </div>
              </div>
            </div>
          </>
        )}
        <div className="bg-white p-4 rounded-lg flex justify-between items-center w-full sticky bottom-0 mt-3">
          {/* Left Section: Dropdown */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Pilih Respon Status</label>
            <Select
              defaultValue={
                step == 1 ? kyc?.statusLevelOne : kyc?.statusLevelTwo
              }
              options={[
                { label: "In Review", value: "IN_PROGRESS" },
                { label: "Rejected", value: "REJECTED" },
                { label: "Approved", value: "APPROVED" },
              ]}
              className="w-48"
              onChange={(v) => setStatusReason(v)}
            />
          </div>

          {/* Right Section: Submit Button */}
          <Button
            type="primary"
            loading={pendingUpdateStatus}
            disabled={pendingUpdateStatus}
            onClick={() => mutateUpdateStatus({ statusLevelOne: statusReason })}
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
      >
        <div className="flex justify-center items-center h-full">
          <ProtectedFile
            keyFile={kyc?.domicileLetterKey}
            style={{ width: 700, height: 600 }}
            type="file"
          />
        </div>
      </Modal>
    </>
  );
};

export default KYCStep1;
