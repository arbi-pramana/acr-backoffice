const version = import.meta.env.VITE_APP_API_VERSION;

export const ROUTES = {
  auth: {
    login: `/${version}/auth/login`,
  },
  kloter: {
    list: `/${version}/backoffice/catalogs`,
    byId: (id: number) => `${version}/backoffice/catalogs/` + id,
    dashboard: `/${version}/backoffice/catalogs/dashboard`,
    updateById: (id: number) => `/${version}/backoffice/catalogs/` + id,
    create: `/${version}/backoffice/catalogs`,
  },
  slot: {
    create: `/${version}/backoffice/slots`,
    update: (id: number) => `/${version}/backoffice/slots/` + id,
    delete: (id: number) => `/${version}/backoffice/slots/` + id,
    getByCatalogId: (id: number) => `/${version}/backoffice/slots/` + id,
  },
};
