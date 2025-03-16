import { storage } from "./local-storage";

export const isAuthenticated = () => {
  const session = storage.getItem("session", false);
  return !!session;
};
