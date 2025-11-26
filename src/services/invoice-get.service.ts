import http from "../helper/http";
import { ROUTES } from "../routes/api";
import {
  createInvoiceGetParams,
  InvoiceGet,
  ListResponse,
  Params,
  updateInvoiceGetByIdParams,
} from "../types";

export const invoiceGetService = {
  async getInvoiceGets(params: Params) {
    const data = (await http.get(ROUTES.invoiceGet.list, {
      params,
    })) as ListResponse<InvoiceGet>;

    return data;
  },
  async getInvoiceGetByUuid(uuid: string) {
    const data = (await http.get(ROUTES.invoiceGet.byUuid(uuid))) as InvoiceGet;
    return data;
  },
  async updateInvoiceGetById(params: updateInvoiceGetByIdParams) {
    const data = await http.put(
      ROUTES.invoiceGet.updateById(params.id),
      params.body
    );
    return data;
  },
  async createInvoiceGet(body: createInvoiceGetParams) {
    const data = await http.post(ROUTES.invoiceGet.create, body);
    return data;
  },
  async uploadCSV(body: File) {
    const formData = new FormData();
    formData.append("file", body);
    const data = await http.post(ROUTES.invoiceGet.uploadCatalogCSV, formData);
    return data;
  },
};
