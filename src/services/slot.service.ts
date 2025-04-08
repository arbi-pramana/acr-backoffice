import http from "../helper/http";
import { createSlotParams, Slot } from "../types";

export const slotService = {
  async getSlotByCatalogId(id: number) {
    const data = (await http.get("/v1/slots/" + id)) as Slot[];
    return data;
  },
  async createSlot(body: createSlotParams) {
    const data = await http.post("/v1/slots", body);
    return data;
  },
  async deleteSlot(id: number) {
    const data = await http.delete("/v1/slots/" + id);
    return data;
  },
};
