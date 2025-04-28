import http from "../helper/http";
import { ROUTES } from "../routes/api";
import {
  AccountCatalog,
  AccountDetail,
  AccountInstallment,
  AccountInstallmentPayment,
  AccountInstallmentPayout,
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
  async getAccountInstallment(userId: string, catalogId: number) {
    const data = (await http.get(ROUTES.account.installment(userId), {
      params: { catalogId: catalogId },
    })) as AccountInstallment[];
    return data;
  },
  async getAccountInstallmentPayout(userId: string, installmentIds: number[]) {
    const data = (await http.get(ROUTES.account.installmentPayout(userId), {
      params: { installmentIds: installmentIds.join(",") },
    })) as AccountInstallmentPayout[];
    return data;
  },
  async getAccountInstallmentPayment(userId: string, installmentIds: number[]) {
    const data = (await http.get(ROUTES.account.installmentPayment(userId), {
      params: { installmentIds: installmentIds.join(",") },
    })) as AccountInstallmentPayment[];
    return data;
  },
  async getAccountCatalog(id: string, params: unknown) {
    const data = (await http.get(ROUTES.account.catalog(id), {
      params,
    })) as ListResponse<AccountCatalog>;
    return data;
  },
};
