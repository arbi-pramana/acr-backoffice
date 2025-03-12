import CryptoJS from "crypto-js";

export const storage = {
  getItem: (key: string) => {
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) return null;

    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse("very-secret-key")
    );

    return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
  },
  setItem: (key: string, data: unknown, isJson: boolean) => {
    const encrypted = (isJson ? JSON.stringify(data) : data) as string;
    const encryptedData = CryptoJS.AES.encrypt(
      encrypted,
      CryptoJS.enc.Utf8.parse("very-secret-key")
    );

    localStorage.setItem(key, encryptedData.toString());
  },
};
