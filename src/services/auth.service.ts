import { AnyUseMutationOptions, useMutation } from "@tanstack/react-query";
import http from "../helper/http";
import { ROUTES } from "../routes/api";

export const authService = {
  async login(value: { email: string; password: string }): Promise<unknown> {
    const data = await http.post("/v1/auth/login", value);
    return data;
  },
  async image(key: string) {
    const data = (await http.get(ROUTES.auth.image(key))) as {
      presignedUrl: string;
    };
    return data;
  },
};

export const useLogin = (options?: AnyUseMutationOptions) => {
  return useMutation({
    mutationFn: authService.login,
    ...options,
  });
};

export const getImage = async (key: string) => {
  const data = await http.get(ROUTES.auth.image(key));
  return data.data.presignedUrl;
};
