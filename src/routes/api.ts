const version = import.meta.env.VITE_APP_API_VERSION;

export const ROUTES = {
  auth: {
    login: `/${version}/auth/login`,
    image: (key: string) => `/${version}/buckets?key=${key}`,
  },
  general: {
    bank: `/${version}/banks/public`,
    account: `/${version}/accounts/details`,
  },
  account: {
    list: `/${version}/backoffice/accounts`,
    byId: (id: string) => `${version}/backoffice/accounts/` + id,
    installment: (id: string) =>
      `${version}/backoffice/accounts/installments/` + id,
    installmentPayout: (id: string) =>
      `${version}/backoffice/accounts/installments/payouts/` + id,
    installmentPayment: (id: string) =>
      `${version}/backoffice/accounts/installments/payments/` + id,
    catalog: (id: string) => `${version}/backoffice/accounts/catalogs/` + id,
  },
  kyc: {
    list: `/${version}/backoffice/kycs`,
    byId: (id: string) => `${version}/backoffice/kycs/` + id,
    byIdMatch: (id: string) => `${version}/backoffice/kycs/compare/` + id,
    updateStatusReason: (id: string) =>
      `${version}/backoffice/kycs/status-reason/` + id,
    updateLevelOne: (id: string) =>
      `${version}/backoffice/kycs/level-one/` + id,
    updateLevelTwo: (id: string) =>
      `${version}/backoffice/kycs/level-two/` + id,
  },
  kloter: {
    list: `/${version}/backoffice/catalogs`,
    byId: (id: number) => `${version}/backoffice/catalogs/` + id,
    dashboard: `/${version}/backoffice/catalogs/dashboard`,
    updateById: (id: number) => `/${version}/backoffice/catalogs/` + id,
    create: `/${version}/backoffice/catalogs`,
    uploadCatalogCSV: `/${version}/backoffice/catalogs/csv`,
  },
  slot: {
    create: `/${version}/backoffice/slots`,
    update: (id: number) => `/${version}/backoffice/slots/` + id,
    delete: (id: number) => `/${version}/backoffice/slots/` + id,
    getByCatalogId: (id: number) => `/${version}/backoffice/slots/` + id,
    uploadSlotCSV: (catalogId: number) =>
      `/${version}/backoffice/slots/${catalogId}/csv`,
  },
};
