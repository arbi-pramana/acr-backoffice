import http from "../helper/http";
import { ROUTES } from "../routes/api";
import {
  AccountCatalog,
  AccountDetail,
  AccountInstallment,
  AccountList,
  ListResponse,
} from "../types";

export const accountService = {
  async getAccounts(params: unknown) {
    const data = (await http.get(ROUTES.account.list, {
      params,
    })) as ListResponse<AccountList>;
    return data;
  },
  async getAccountById(id: string) {
    const data = (await http.get(ROUTES.account.byId(id))) as AccountDetail;
    return data;
  },
  async getAccountInstallment(id: string) {
    const data = (await http.get(
      ROUTES.account.installment(id)
    )) as AccountInstallment;
    return data;
  },
  async getAccountCatalog(id: string, params: unknown) {
    const data = (await http.get(ROUTES.account.catalog(id), {
      params,
    })) as ListResponse<AccountCatalog>;
    return data;
  },
};
