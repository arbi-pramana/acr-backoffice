import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Pagination, Table } from "antd";

const data = [
  {
    key: "1",
    user: "John Doe",
    email: "john@example.com",
    documentType: "Passport",
    status: "Pending",
    date: "2025-01-15",
  },
  {
    key: "2",
    user: "Jane Smith",
    email: "jane@example.com",
    documentType: "Driver's License",
    status: "Verified",
    date: "2025-01-14",
  },
];

const columns = [
  {
    title: "User",
    dataIndex: "user",
    key: "user",
    render: (text: string, record: { email: string }) => (
      <div>
        <Avatar icon={<UserOutlined />} />
        <span style={{ marginLeft: 8 }}>{text}</span>
        <div>{record.email}</div>
      </div>
    ),
  },
  {
    title: "Document Type",
    dataIndex: "documentType",
    key: "documentType",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Submitted Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Actions",
    key: "actions",
    render: () => <Button type="link">View</Button>,
  },
];

const KYCManagement = () => {
  return (
    <Card title="KYC Management">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Card.Grid style={{ width: "20%", textAlign: "center" }}>
          Pending Verification
          <br />
          245
        </Card.Grid>
        <Card.Grid style={{ width: "20%", textAlign: "center" }}>
          Verified Users
          <br />
          1,234
        </Card.Grid>
        <Card.Grid style={{ width: "20%", textAlign: "center" }}>
          Rejected
          <br />
          23
        </Card.Grid>
        <Card.Grid style={{ width: "20%", textAlign: "center" }}>
          Total Users
          <br />
          2,445
        </Card.Grid>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} />
      <Pagination
        defaultCurrent={1}
        total={245}
        style={{ marginTop: 16, textAlign: "right" }}
      />
    </Card>
  );
};

export default KYCManagement;
