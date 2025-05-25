import http from "../helper/http";
import { ROUTES } from "../routes/api";
import { KYCDetail, KYCList, KYCMatch, ListResponse } from "../types";

export const kycService = {
  async getKycs(params: unknown) {
    const data = (await http.get(ROUTES.kyc.list, {
      params,
    })) as ListResponse<KYCList>;
    return data;
  },
  async getKycById(id: string) {
    const data = (await http.get(ROUTES.kyc.byId(id))) as KYCDetail;
    return data;
  },
  async getKycByIdMatch(id: string) {
    const data = (await http.get(ROUTES.kyc.byIdMatch(id))) as KYCMatch;
    return data;
  },
  async updateStatusReason(id: string, param: unknown) {
    const data = (await http.patch(
      ROUTES.kyc.updateStatusReason(id),
      param
    )) as KYCMatch;
    return data;
  },
  async updateLevelOne(id: string, param: unknown) {
    const data = await http.patch(ROUTES.kyc.updateLevelOne(id), param);
    return data;
  },
  async updateLevelTwo(id: string, param: unknown) {
    const data = await http.patch(ROUTES.kyc.updateLevelTwo(id), param);
    return data;
  },
  async sendNotifRejectLevelOne(id: string) {
    const data = await http.post(ROUTES.kyc.sendNotifRejectLevelOne(id));
    return data;
  },
};
