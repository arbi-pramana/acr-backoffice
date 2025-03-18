import { Avatar, Dropdown, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState(1);

  const items: ItemType<MenuItemType>[] = [
    {
      label: "KYC Management",
      type: "item",
      key: 1,
      onClick: (v: { key: string }) => setActiveMenu(parseInt(v.key)),
    },
    {
      label: "Account Management",
      type: "item",
      key: 2,
      onClick: (v: { key: string }) => setActiveMenu(parseInt(v.key)),
    },
    {
      label: "Catalog",
      type: "item",
      key: 3,
      onClick: (v: { key: string }) => setActiveMenu(parseInt(v.key)),
    },
    {
      label: "Transaction History",
      type: "item",
      key: 4,
      onClick: (v: { key: string }) => setActiveMenu(parseInt(v.key)),
    },
  ];

  const children: Record<number, React.ReactNode> = {
    1: "kyc",
    2: "account",
    3: "catalog",
    4: "transaction",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <Header
          style={{
            background: "#364153",
            padding: 0,
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Admin Dashboard
        </Header>

        <div className="flex items-center justify-center p-4 gap-2">
          <div>
            <img src="/vite.svg" alt="Vite Logo" width={28} />
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="text-left w-full">Admin User</div>
            <div className="text-left w-full">admin@gmail.com</div>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[activeMenu.toString()]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <div className="flex items-center justify-end h-full">
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "1",
                    label: "Log out",
                    extra: <LogoutOutlined />,
                  },
                ],
              }}
            >
              <div className="flex items-center justify-end h-full p-4 cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>Admin User</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: "16px" }}>{children[activeMenu]}</Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
