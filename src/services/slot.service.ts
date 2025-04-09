import http from "../helper/http";
import { ROUTES } from "../routes/api";
import { createSlotParams, Slot } from "../types";

export const slotService = {
  async getSlotByCatalogId(id: number) {
    const data = (await http.get(ROUTES.slot.getByCatalogId(id))) as Slot[];
    return data;
  },
  async createSlot(body: createSlotParams) {
    const data = await http.post(ROUTES.slot.create, body);
    return data;
  },
  async deleteSlot(id: number) {
    const data = await http.delete(ROUTES.slot.delete(id));
    return data;
  },
};
