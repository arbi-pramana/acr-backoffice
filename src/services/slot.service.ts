import http from "../helper/http";
import { createSlotParams, Kloter, ListResponse } from "../types";

export const slotService = {
  async getSlotByCatalogId(id: number) {
    const data = (await http.get("/v1/slots/" + id)) as ListResponse<Kloter>;
    return data;
  },
  async createSlot(body: createSlotParams) {
    const data = await http.post("/v1/slots", body);
    return data;
  },
};
