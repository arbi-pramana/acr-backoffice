export const getErrorMessage = (type: string) => {
  if (type === "DuplicateGroupUniqueIdentifierException") {
    return "Group ID sudah ada";
  } else if (type === "DuplicateBankAccountNumberException") {
    return "Bank Akun Sudah Ada";
  } else if (type === "DuplicateMobileException") {
    return "Nomor HP sudah di gunakan";
  }
  return "";
};
