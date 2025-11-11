import http from "../helper/http";
import { ROUTES } from "../routes/api";
import {
  createKloterParams,
  Kloter,
  KloterDashboard,
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
  async getAllKloters() {
    const allKloters: Kloter[] = [];
    let page = 0;
    const size = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getKloters({ page, size, search: "" });
      allKloters.push(...response.content);
      page++;
      hasMore = page < response.totalPages;
    }

    return allKloters;
  },
  async getKloterById(id: number) {
    const data = (await http.get(ROUTES.kloter.byId(id))) as Kloter;
    return data;
  },
  async getKloterDashboard() {
    const data = (await http.get(ROUTES.kloter.dashboard)) as KloterDashboard;
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
  async uploadCSV(body: File) {
    const formData = new FormData();
    formData.append("file", body);
    const data = await http.post(ROUTES.kloter.uploadCatalogCSV, formData);
    return data;
  },
};
