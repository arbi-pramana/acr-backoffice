// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { Avatar, Layout, Menu } from "antd";
// import "./App.css";
import Sider from "antd/es/layout/Sider";
import {
  AppstoreOutlined,
  FileTextOutlined,
  HistoryOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";

function App() {
  // const [count, setCount] = useState(0);

  return (
    // make routing work using react-router-dom
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={} /> */}
      </Routes>
    </BrowserRouter>
    // <Layout style={{ minHeight: "100vh" }}>
    //   <Sider>
    //     {/* <div className="text-lg font-bold text-center bg-gray-700 h">
    //       Admin Dashboard
    //     </div> */}
    //     <Header
    //       style={{
    //         background: "#364153",
    //         padding: 0,
    //         textAlign: "center",
    //         color: "white",
    //         fontWeight: "bold",
    //       }}
    //     >
    //       Admin Dashboard
    //     </Header>

    //     <div className="flex items-center justify-center p-4 gap-2">
    //       <div>
    //         <img src="/vite.svg" alt="Vite Logo" width={28} />
    //       </div>
    //       <div className="flex flex-col items-center w-full">
    //         <div className="text-left w-full">Admin User</div>
    //         <div className="text-left w-full">admin@gmail.com</div>
    //       </div>
    //     </div>
    //     <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
    //       <Menu.Item key="1" icon={<FileTextOutlined />}>
    //         KYC Management
    //       </Menu.Item>
    //       <Menu.Item key="2" icon={<UserOutlined />}>
    //         Account Management
    //       </Menu.Item>
    //       <Menu.Item key="3" icon={<AppstoreOutlined />}>
    //         Catalog
    //       </Menu.Item>
    //       <Menu.Item key="4" icon={<HistoryOutlined />}>
    //         Transaction History
    //       </Menu.Item>
    //     </Menu>
    //   </Sider>
    //   <Layout>
    //     <Header style={{ background: "#fff", padding: 0 }}>
    //       <div className="flex items-center justify-end h-full p-4">
    //         <Avatar icon={<UserOutlined />} />
    //         <span style={{ marginLeft: 8 }}>Admin User</span>
    //       </div>
    //     </Header>
    //     <Content style={{ margin: "16px" }}></Content>
    //   </Layout>
    // </Layout>
  );
}

export default App;
