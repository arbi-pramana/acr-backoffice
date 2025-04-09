import { Button, Form, Input, notification } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../helper/is-authenticated";
import { storage } from "../helper/local-storage";
import { useLogin } from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { mutate, isPending } = useLogin();

  const onFinish = (values: { email: string; password: string }) => {
    mutate(values, {
      onSuccess(data) {
        if (data.status === 401) {
          return;
        }
        if (!data.roles.includes("ROLE_ADMIN")) {
          notification.warning({
            message: "Your role cannot access this application",
          });
          return;
        }
        storage.setItem("session", JSON.stringify(data));
        navigate("/dashboard?tab=kyc");
      },
    });
  };

  useEffect(() => {
    const auth = isAuthenticated();
    if (auth) navigate("/dashboard?tab=kyc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-[100vh] flex items-center justify-center ">
      <div className="w-1/2 h-full flex flex-col items-center justify-center text-black">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div
            className="font-bold text-3xl mb-3 w-1/2"
            onClick={() => storage.setItem("key", "haha")}
          >
            Welcome Back!
          </div>
          <Form
            form={form}
            layout="vertical"
            className="w-1/2"
            onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              disabled={isPending}
              loading={isPending}
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>
      <div className="w-1/2 h-full flex items-center justify-center bg-primary-800">
        <img src="/acr-logo.svg" alt="Vite Logo" width={128} />
      </div>
    </div>
  );
};

export default Login;
