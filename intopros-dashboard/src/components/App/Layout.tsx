import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Dropdown, Layout, Menu, Row } from "antd";

import { GlobalContext } from "../../context/GlobalContext";

import SideNav from "./Sidenav";
import { deleteToken } from "../../utils/cookies";

export default function AppLayout(props: any) {
  const gContext = useContext(GlobalContext);
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);

  if (!gContext.hasToken()) return null;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider
        style={{
          overflowY: "scroll",
          height: "100vh",
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
        width="300"
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
      >
        <SideNav collapsed={collapsed} />
      </Layout.Sider>

      <Layout>
        <Layout.Header
          style={{
            background: "white",
            position: "sticky",
            top: 0,
            zIndex: 10,
            borderBottom: "1px solid #d2d2d2",
          }}
        >
          <Row justify="end">
            <div>
              <Dropdown.Button
                overlay={
                  <Menu>
                    <Menu.Item
                      key="logout"
                      onClick={() => {
                        deleteToken();
                        router.push("/login");
                      }}
                    >
                      Logout
                    </Menu.Item>
                  </Menu>
                }
              >
                <UserOutlined />
                {gContext.user?.username}
              </Dropdown.Button>
              <span></span>
            </div>
          </Row>
        </Layout.Header>
        <Layout.Content style={{ padding: "0 1rem" }}>
          {props.children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
