import {
  AnyUseMutationOptions,
  useMutation,
  //   useQuery,
  //   UseQueryOptions,
} from "@tanstack/react-query";
import http from "../helper/http";

export const authService = {
  async login(value: { email: string; password: string }): Promise<unknown> {
    const data = await http.post("/v1/auth/login", value);
    return data;
  },
};

export const useLogin = (options?: AnyUseMutationOptions) => {
  return useMutation({
    mutationFn: authService.login,
    ...options,
  });
};
