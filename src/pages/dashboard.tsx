import { Avatar, Divider, Dropdown, Layout, Menu, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import { SettingOutlined, DownOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import KloterManagement from "./kloter-management";
import KYCManagement from "./kyc-management";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [collapse, setCollapse] = useState(false);
  const currentTab = searchParams.get("tab") ?? "kyc";

  const menus = [
    {
      title: "KYC Management",
      iconWhite: "/kyc-white.svg",
      iconGrey: "/kyc-grey.svg",
      tab: "kyc",
    },
    {
      title: "Kloter Management",
      iconWhite: "/voucher-white.svg",
      iconGrey: "/voucher-grey.svg",
      tab: "kloter",
    },
  ];

  const generateMenus = () => {
    return menus.map((v, key) => ({
      icon:
        currentTab == v.tab ? (
          <img src={v.iconWhite} alt="" />
        ) : (
          <img src={v.iconGrey} alt="" />
        ),
      label: v.title,
      type: "item",
      className:
        currentTab == v.tab
          ? "bg-linear-to-r from-primary-400 to-primary-600"
          : "",
      style: currentTab == v.tab ? { color: "white" } : {},
      key: key,
      onClick: () => {
        setSearchParams({ tab: v.tab });
      },
    }));
  };

  const items = generateMenus();

  const children: Record<string, React.ReactNode> = {
    kyc: <KYCManagement />,
    kloter: <KloterManagement />,
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapse}
        onCollapse={(val) => setCollapse(val)}
        theme="light"
        width={"18%"}
      >
        <Header
          style={{
            background: "white",
            padding: 20,
            textAlign: "center",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            lineHeight: "16px",
          }}
        >
          {collapse ? (
            <img src="/acr-logo.svg" alt="Logo" width={40} />
          ) : (
            <>
              <img src="/acr-logo.svg" alt="Logo" width={40} />
              <div className="ml-2 text-primary-600">ACR Digital</div>
            </>
          )}
        </Header>

        <div className="h-[91%] flex justify-between flex-col">
          <Menu
            mode="inline"
            defaultSelectedKeys={[currentTab]}
            items={items as ItemType<MenuItemType>[]}
            style={{ padding: 12 }}
          />
          <div>
            <Menu
              items={[
                {
                  key: 1,
                  label: "Settings Account",
                  icon: <SettingOutlined />,
                  className: "font-semibold",
                },
              ]}
            />
            <Divider style={{ marginTop: 12 }} />
            {collapse ? (
              <div className="flex justify-center items-center cursor-pointer p-3">
                <Avatar
                  src="https://i.pravatar.cc/50" // Replace with your image URL
                  size={40}
                />
              </div>
            ) : (
              <div className="mx-5 border border-solid border-gray-400 rounded-lg p-3 cursor-pointer max-h-[70px]">
                <div className="flex flex-row items-center">
                  <Avatar
                    src="https://i.pravatar.cc/50" // Replace with your image URL
                    size={40}
                  />
                  <div className="ml-1 grow">
                    <Typography.Text strong>Olivia Rhye</Typography.Text>
                    <br />
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: "12px" }}
                    >
                      Oliviaacr@gmail.com
                    </Typography.Text>
                  </div>
                  <Dropdown menu={{ items: [] }}>
                    <DownOutlined style={{ fontSize: "14px", color: "#aaa" }} />
                  </Dropdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </Sider>
      <Layout className="border border-solid border-l border-gray-300">
        <Content className="p-4 bg-white">{children[currentTab]}</Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
