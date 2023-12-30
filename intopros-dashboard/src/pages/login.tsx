import { Button, Card, Form, Input, notification, Row } from "antd";
import { useContext, useState } from "react";

import { GlobalContext } from "../context/GlobalContext";
import { makeRequest } from "../utils/api";
import { deleteToken, setToken } from "../utils/cookies";
import { useRouter } from "next/router";

export default function Login() {
  const { setUser, hasToken } = useContext(GlobalContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const loginUser = async (values: any) => {
    setIsLoading(true);
    const resp = await makeRequest("/auth/login", {
      method: "POST",
      data: values,
    });
    if (!resp) {
      setIsLoading(false);
      return;
    }

    setToken(resp?.data?.data?.access_token);

    const resp2 = await makeRequest("/users/me", { method: "GET" });
    if (!resp2) {
      setIsLoading(false);
      return;
    }

    if (!["admin", "support"].includes(resp2?.data?.data?.role)) {
      notification.error({
        message: "You are not authorized to preview this website!",
      });
      setIsLoading(false);
      deleteToken();
      return;
    }

    setUser(resp2.data?.data);
    router.push("/");
    setIsLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        bodyStyle={{
          maxWidth: "100vw",
          minWidth: 512,
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        }}
      >
        <Row justify="center">
          <img
            src="/logo.png"
            width={180}
            height={60}
            alt="Intopros"
            style={{ objectFit: "contain" }}
          />
        </Row>

        <Form onFinish={loginUser} style={{ marginTop: "3rem" }}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Email or Username is required!" },
            ]}
          >
            <Input
              size="large"
              placeholder="Email or Username"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required!" }]}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}

Login.getLayout = function getLayout(page: any) {
  return <>{page}</>;
};
