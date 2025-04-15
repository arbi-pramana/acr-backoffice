// import CryptoJS from "crypto-js";
// const secret = "very-secret-key";
// import { storage as storagee } from "../src/helper/local-storage";
export * from "../src/helper/local-storage";
// export const storage = {
//   getItem: (key: string, isJson: boolean) => {
//     const encryptedData = localStorage.getItem(key);
//     if (!encryptedData) return null;

//     const decryptedData = CryptoJS.AES.decrypt(encryptedData, secret);

//     return isJson
//       ? JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8))
//       : decryptedData.toString(CryptoJS.enc.Utf8);
//   },
//   setItem: (key: string, data: string) => {
//     const encryptedData = CryptoJS.AES.encrypt(data, secret).toString();

//     localStorage.setItem(key, encryptedData);
//   },
// };
