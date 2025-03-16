import http from "../helper/http";

export const authService = {
  async login(value: { email: string; password: string }): Promise<any> {
    const data = await http.post("/v1/auth/login", { body: value });
    return data;
  },
};

// export const useLogin = (options?: UseMutationOptions) => {
//   return useMutation({
//     mutationFn: (val: { email: string; password: string }) =>
//       authService.login(val),
//     ...options,
//   });
// };
