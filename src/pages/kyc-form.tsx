import {
  ArrowLeftOutlined,
  BellFilled,
  FileOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import { Alert, Button, Divider, Form, Input, Progress } from "antd";
import ToggleSwitch from "../components/switch";
import OCRGuide from "../components/ocr-guide";
import Select from "../components/select";
import { useState } from "react";

const KYCStep1 = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);

  return (
    <>
      <div className="w-full flex justify-between p-3 text-primary-500 font-semibold bg-white">
        <div className="flex gap-3">
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
        <div className="bg-danger-700 rounded-lg">
          <div className="bg-white flex justify-between rounded-lg p-3">
            <div>
              <div className="font-bold">Windah Basutri</div>
              <div className="font-semibold">
                Last submitted: 12 Maret 2025 | 08:00 PM
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
          <div className="bg-danger-700 flex justify-center text-white font-semibold rounded-lg py-1">
            Status Reject
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
                    <img src="/acr-logo.svg" width={200} alt="" />
                  </div>
                  <div className="flex gap-3">
                    <div className="font-semibold">Score Data Anda</div>
                    <Progress
                      percent={100}
                      strokeWidth={8}
                      //   strokeColor={'orange'}
                      style={{ width: "70%" }}
                    />
                  </div>
                </div>
                <div className="flex flex-col border border-solid border-basic-300 rounded-lg w-[50%] p-3">
                  <div className="font-semibold">Foto KTP dan Selfie</div>
                  <div className="flex justify-center w-full">
                    <img src="/acr-logo.svg" width={200} alt="" />
                  </div>
                  <div className="flex gap-3">
                    <div className="font-semibold">Score Data Anda</div>
                    <Progress
                      percent={100}
                      strokeWidth={8}
                      //   strokeColor={'orange'}
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
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Nama Lengkap">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Tempat Lahir">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Tanggal Lahir">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Jenis Kelamin">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Golongan Darah">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Alamat Sesuai KTP">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4">
                      <Form.Item label="RT">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="RW">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Provinsi">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Kota">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Kecamatan">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Kelurahan">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Agama">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Status">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
                      </Form.Item>
                      <Form.Item label="Pekerjaan">
                        <div className="flex items-center gap-1 w-full">
                          <Input />
                          <ToggleSwitch />
                        </div>
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
                    SK Domisili-Newton.pdf
                  </p>
                  <div className="flex gap-3">
                    <Button className="mt-2">Upload Ulang</Button>
                    <Button type="primary" className="mt-2">
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
                  <Input defaultValue="Jl. Sudican" />
                </div>

                <div>
                  <label className="text-sm font-medium">RT</label>
                  <Input defaultValue="003" />
                </div>
                <div>
                  <label className="text-sm font-medium">RW</label>
                  <Input defaultValue="004" />
                </div>

                <div>
                  <label className="text-sm font-medium">Provinsi</label>
                  <Select
                    defaultValue="DKI Jakarta"
                    options={[{ label: "DKI Jakarta", value: 1 }]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Kota</label>
                  <Select
                    defaultValue="Jakarta Selatan"
                    options={[{ label: "Jakarta Selatan", value: 1 }]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Kecamatan</label>
                  <Select
                    defaultValue="DKI Jakarta"
                    options={[{ label: "DKI Jakarta", value: 1 }]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Kelurahan</label>
                  <Select
                    defaultValue="Guntur"
                    options={[{ label: "Guntur", value: 1 }]}
                    className="w-full"
                  />
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
                  <label className="text-sm font-medium">Nama Bank</label>
                  <Input defaultValue="003" />
                </div>
                <div>
                  <label className="text-sm font-medium">Nomor Rekening</label>
                  <Input defaultValue="004" />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Nama Pemilik Rekening
                  </label>
                  <div className="flex items-center gap-3">
                    <Input defaultValue="004" />
                    <ToggleSwitch />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Nomor Handphone Anda
                  </label>
                  <Input defaultValue="004" />
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
                  <label className="text-sm font-medium">
                    Pendidikan Terakhir
                  </label>
                  <Select defaultValue="Mandiri" className="w-full"></Select>
                </div>

                {/* Pekerjaan */}
                <div>
                  <label className="text-sm font-medium">Pekerjaan</label>
                  <Select
                    defaultValue="Business Intelligence"
                    className="w-full"
                  ></Select>
                </div>

                {/* Posisi */}
                <div>
                  <label className="text-sm font-medium">Posisi</label>
                  <Select defaultValue="Management" className="w-full"></Select>
                </div>

                {/* Penghasilan per Tahun */}
                <div>
                  <label className="text-sm font-medium">
                    Penghasilan per Tahun
                  </label>
                  <Select
                    defaultValue="Rp 100juta - Rp 250juta"
                    className="w-full"
                  ></Select>
                </div>

                {/* Nama Perusahaan */}
                <div>
                  <label className="text-sm font-medium">Nama Perusahaan</label>
                  <Input defaultValue="Lark Company" className="w-full" />
                </div>

                {/* Alamat Perusahaan */}
                <div>
                  <label className="text-sm font-medium">
                    Alamat Perusahaan
                  </label>
                  <Input defaultValue="Lark Company" className="w-full" />
                </div>

                {/* RT & RW */}
                <div>
                  <label className="text-sm font-medium">RT</label>
                  <Input defaultValue="003" className="w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium">RW</label>
                  <Input defaultValue="005" className="w-full" />
                </div>

                {/* Provinsi & Kota */}
                <div>
                  <label className="text-sm font-medium">Provinsi</label>
                  <Select
                    defaultValue="DKI Jakarta"
                    className="w-full"
                  ></Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Kota</label>
                  <Select
                    defaultValue="Jakarta Selatan"
                    className="w-full"
                  ></Select>
                </div>

                {/* Kecamatan & Kelurahan */}
                <div>
                  <label className="text-sm font-medium">Kecamatan</label>
                  <Select
                    defaultValue="DKI Jakarta"
                    className="w-full"
                  ></Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Kelurahan</label>
                  <Select
                    defaultValue="Jakarta Selatan"
                    className="w-full"
                  ></Select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Nomor Telepon Perusahaan
                  </label>

                  <Input addonBefore="+62" defaultValue="228973908" />
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
              defaultValue="In Progress"
              options={[
                { label: "In Progress", value: 1 },
                { label: "In Review", value: 2 },
                { label: "Rejected", value: 3 },
                { label: "Approved", value: 4 },
              ]}
              className="w-48"
            />
          </div>

          {/* Right Section: Submit Button */}
          <Button
            type="primary"
            onClick={() => setStep(2)}
            className="bg-purple-600 text-white px-6 py-2 rounded-full"
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default KYCStep1;
