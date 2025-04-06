import http from "../helper/http";
import {
  createKloterParams,
  Kloter,
  ListResponse,
  Params,
  updateKloterByIdParams,
} from "../types";

export const kloterService = {
  async getKloters(params: Params) {
    const data = (await http.get("/v1/catalogs/public", {
      params,
    })) as ListResponse<Kloter>;
    return data;
  },
  async getKloterById(id: number) {
    const data = (await http.get("/v1/catalogs/" + id)) as Kloter;
    return data;
  },
  async updateKloterById(params: updateKloterByIdParams) {
    const data = await http.patch("/v1/catalogs/" + params.id, {
      body: params.body,
    });
    return data;
  },
  async createKloter(body: createKloterParams) {
    const data = await http.post("/v1/catalogs", body);
    return data;
  },
};
