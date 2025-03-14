import { Button, ConfigProvider, Form, Input, notification } from "antd";
import { authService } from "../../services/auth.service";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  const [form] = Form.useForm();

  const { mutate } = useMutation({ mutationFn: authService.login });

  const onFinish = (values: { email: string; password: string }) => {
    mutate(values);
  };

  return (
    <ConfigProvider>
      <div className="w-full h-[100vh] flex items-center justify-center ">
        <div className="w-1/2 h-full flex flex-col items-center justify-center bg-gray-400">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div
              className="font-bold text-2xl"
              onClick={() => {
                console.log(notification);
                notification.success({
                  message: "Hello",
                  placement: "bottomLeft",
                });
              }}
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
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
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
                  <Input placeholder="Password" />
                </Form.Item>
              </Form.Item>
              <Button type="primary" block htmlType="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
        <div className="w-1/2 h-full flex items-center justify-center">
          <img src="/vite.svg" alt="Vite Logo" width={128} />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Login;
