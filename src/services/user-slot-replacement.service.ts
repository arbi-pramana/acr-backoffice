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
      ROUTES.userSlotReplacement.byId(id)
    )) as UserSlotReplacement;
    return data;
  },
  async updateUserSlotReplacementById(
    params: updateUserSlotReplacementByIdParams
  ) {
    const data = await http.patch(
      ROUTES.userSlotReplacement.updateById(params.id),
      params.body
    );
    return data;
  },
  async createUserSlotReplacement(body: createUserSlotReplacementParams) {
    const data = await http.post(ROUTES.userSlotReplacement.create, body);
    return data;
  },
  async uploadCSV(body: File) {
    const formData = new FormData();
    formData.append("file", body);
    const data = await http.post(
      ROUTES.userSlotReplacement.uploadCatalogCSV,
      formData
    );
    return data;
  },
};
