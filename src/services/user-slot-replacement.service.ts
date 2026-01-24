import http from "../helper/http";
import { ROUTES } from "../routes/api";
import {
  createUserSlotReplacementParams,
  UserSlotReplacement,
  ListResponse,
  Params,
  updateUserSlotReplacementByIdParams,
} from "../types";

export const userSlotReplacementService = {
  async getUserSlotReplacements(params: Params) {
    const data = (await http.get(ROUTES.userSlotReplacement.list, {
      params,
    })) as ListResponse<UserSlotReplacement>;

    return data;
  },
  async getUserSlotReplacementById(id: number) {
    const data = (await http.get(
      ROUTES.userSlotReplacement.byId(id),
    )) as UserSlotReplacement;
    return data;
  },
  async updateUserSlotReplacementById(
    params: updateUserSlotReplacementByIdParams,
  ) {
    const data = await http.patch(
      ROUTES.userSlotReplacement.updateById(params.id),
      params.body,
    );
    return data;
  },
  async createUserSlotReplacement(body: createUserSlotReplacementParams) {
    const data = await http.post(ROUTES.userSlotReplacement.create, body);
    return data;
  },
  async getFee(slotUserId: number) {
    const data: unknown = await http.post(ROUTES.userSlotReplacement.fee, {
      slotUserId,
    });
    return data as { fee: number };
  },
  async uploadCSV(body: File) {
    const formData = new FormData();
    formData.append("file", body);
    const data = await http.post(
      ROUTES.userSlotReplacement.uploadCatalogCSV,
      formData,
    );
    return data;
  },
  async approveById(id: number) {
    const data = await http.post(ROUTES.userSlotReplacement.approveById(id));
    return data;
  },
};
