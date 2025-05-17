export const getErrorMessage = (error: { type: string; message: string }) => {
  if (error.type === "DuplicateGroupUniqueIdentifierException") {
    return "Group ID sudah ada";
  } else if (error.type === "DuplicateBankAccountNumberException") {
    return "Bank Akun Sudah Ada";
  } else if (error.type === "DuplicateMobileException") {
    return "Nomor HP sudah di gunakan";
  } else if (error.message.includes("user with uuid")) {
    return "User belum menyelesaikan KYC 1";
  }
  return error.message ?? "Unknown Error";
};
