import http from "../helper/http";
import { ROUTES } from "../routes/api";
import { Account, Bank } from "../types";

export const generalService = {
  async getBanks() {
    const data = (await http.get(ROUTES.general.bank)) as Bank[];
    return data;
  },
  async getAccount() {
    const data = (await http.get(ROUTES.general.account)) as Account;
    return data;
  },
};
