import http from "../helper/http";
import { ROUTES } from "../routes/api";
import { Bank } from "../types";

export const generalService = {
  async getBanks() {
    const data = (await http.get(ROUTES.general.bank)) as Bank[];
    return data;
  },
};
