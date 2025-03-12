import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import http from "../helper/http";

const kycService = {
  async getUsers() {
    const data = await http.get("/users");
    return data;
  },
};

export const useGetUsers = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: kycService.getUsers,
    ...options,
  });
};
