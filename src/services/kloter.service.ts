import http from "../helper/http";
import { ROUTES } from "../routes/api";
import {
  createKloterParams,
  Kloter,
  ListResponse,
  Params,
  updateKloterByIdParams,
} from "../types";

export const kloterService = {
  async getKloters(params: Params) {
    const data = (await http.get(ROUTES.kloter.list, {
      params,
    })) as ListResponse<Kloter>;
    return data;
  },
  async getKloterById(id: number) {
    const data = (await http.get(ROUTES.kloter.byId(id))) as Kloter;
    return data;
  },
  async updateKloterById(params: updateKloterByIdParams) {
    const data = await http.patch(
      ROUTES.kloter.updateById(params.id),
      params.body
    );
    return data;
  },
  async createKloter(body: createKloterParams) {
    const data = await http.post(ROUTES.kloter.create, body);
    return data;
  },
};
