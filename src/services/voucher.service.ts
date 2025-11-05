import http from "../helper/http";
import { ROUTES } from "../routes/api";
import {
  createVoucherParams,
  Voucher,
  VoucherDashboard,
  ListResponse,
  Params,
  updateVoucherByIdParams,
} from "../types";

export const voucherService = {
  async getVouchers(params: Params) {
    const data = (await http.get(ROUTES.voucher.list, {
      params,
    })) as ListResponse<Voucher>;

    return data;
  },
  async getVoucherByCode(code: string) {
    const data = (await http.get(ROUTES.voucher.byCode(code))) as Voucher;
    return data;
  },
  async getVoucherDashboard() {
    // const data = (await http.get(ROUTES.voucher.dashboard)) as VoucherDashboard;
    // return data;

    const data: VoucherDashboard = {
      totalVouchers: 100,
      activeVouchers: 75,
      inactiveVouchers: 25,
      expiringVouchers: 10,
    };
    return data;
  },
  async updateVoucherById(params: updateVoucherByIdParams) {
    const data = await http.put(
      ROUTES.voucher.updateById(params.id),
      params.body
    );
    return data;
  },
  async createVoucher(body: createVoucherParams) {
    const data = await http.post(ROUTES.voucher.create, body);
    return data;
  },
  async uploadCSV(body: File) {
    const formData = new FormData();
    formData.append("file", body);
    const data = await http.post(ROUTES.voucher.uploadCatalogCSV, formData);
    return data;
  },
};
