import { DashOutlined, DeleteOutlined, EditOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Dropdown, Form, Input, Menu, Modal, notification, Row, Space, Table, Tag, Typography } from "antd";
import { FormInstance, useForm } from "antd/lib/form/Form";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";

import Link from "next/link";
import { useRouter } from "next/router";

import { makeRequest } from "../../../utils/api";
import { GlobalContext } from "../../../context/GlobalContext";

export default function Users() {
  const { user, isAdmin } = useContext(GlobalContext);

  const [form] = useForm();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<any | null>(null);

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const pageSize = 9;
  const [total, setTotal] = useState(1);
  const [currentActivePage, setCurrentActivePage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const toggleActiveStatus = async (record: any) => {
    if (!isAdmin) return;

    const res = await makeRequest(`/users/list/${record.user.id}/`, {
      method: "PATCH",
      data: { isActive: !record.isActive },
    });
    if (res) {
      notification.success({
        message: `Successfully updated active status of ${record.user?.email}!`,
      });

      setUsers(
        users.map((user) =>
          user.id === record.id
            ? {
                ...user,
                isActive: res.data?.data?.isActive,
              }
            : user
        )
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      // sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Role",
      dataIndex: ["user", "role"],
      key: "role",
      render: (text: string) => <Tag color={text === "admin" ? "geekblue" : text === "support" ? "yellow" : "green"}>{text.toUpperCase()}</Tag>,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      render: (_: string, record: any) => {
        const name = [record.firstName, record.middleName, record.lastName];
        return name.filter((nm: any) => nm).length ? name.join(" ") : "-";
      },
      // sorter: (a: any, b: any) => (a.name > b.name ? 1 : -1),
    },
    {
      title: "Sex",
      key: "sex",
      render: (_: string, record: any) => (
        <>
          {record.sex && <Tag color={record.sex ? (["m", "male"].includes(record.sex?.toLowerCase()) ? "blue" : "pink") : "default"}>{record.sex.toUpperCase()}</Tag>}
          {!record.sex && "-"}
        </>
      ),
    },
    {
      title: "Active",
      datIndex: "isActive",
      key: "active",
      render: (_: string, record: any) => (
        <Tag color={record.isActive ? "green" : "red"} onClick={() => toggleActiveStatus(record)} style={{ cursor: isAdmin ? "pointer" : "default" }}>
          {record.isActive ? "YES" : "NO"}
        </Tag>
      ),
    },
    {
      title: "Last Active",
      key: "lastActiveDate",
      dataIndex: ["user", "lastActiveDate"],
      render: (dateValue: string) => <>{dateValue ? dayjs(dateValue).format("YYYY-MM-DD hh:mm") : "-"}</>,
    },
    {
      width: "60px",
      render: (_: string, record: any) => (
        <>
          {/* {!!isAdmin && ( */}

          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            overlay={
              <Menu>
                <Menu.Item>
                  <Link
                    href={{
                      pathname: `/users/${record.user.id}/edit`,
                      query: { t: "system" },
                    }}
                    passHref
                  >
                    <Space>
                      <EditOutlined style={{ cursor: "pointer" }} />
                      <span>Edit</span>
                    </Space>
                  </Link>
                </Menu.Item>
                {user?.id !== record.user.id && (
                  <Menu.Item>
                    <Space onClick={() => deleteUser(record)}>
                      <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                      <span>Delete</span>
                    </Space>
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <Button>
              <DashOutlined />
            </Button>
          </Dropdown>
          {/* )} */}
        </>
      ),
    },
  ];

  const submitFilter = () => {
    const filterValues = form.getFieldsValue();

    fetchUserList(currentActivePage, {
      ...(filterValues.search ? { search: filterValues.search } : {}),
    });

    setIsDrawerVisible(false);
  };

  const fetchUserList = async (activePage = 1, options = {}) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set("take", pageSize.toString());
      params.set("skip", ((activePage - 1) * pageSize).toString());
      params.append("roles", "admin");
      params.append("roles", "support");

      Object.entries(options).forEach(([key, value]: any[]) => {
        params.set(key, value);
      });

      const resp = await makeRequest(`/users/list?${params.toString()}`, {
        method: "GET",
      });
      if (resp) {
        setUsers(resp.data?.data);
        setTotal(resp.data?.pagination?.total);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: any) => {
    setDeleteId(id);
    setOpenModal(true);
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleOk = async () => {
    setIsLoading(true);
    const res = await makeRequest(`/users/list/${deleteId?.id}`, {
      method: "DELETE",
    });
    if (res) {
      notification.success({ message: res.data?.message });
      setDeleteId(null);
      setOpenModal(false);
      fetchUserList();
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Modal
        title="Delete"
        visible={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Yes
          </Button>,
          <Button key="back" type="primary" danger onClick={handleCancel}>
            No
          </Button>,
        ]}
      >
        <div>
          <h4>Do you really want to delete {deleteId?.user.email}?</h4>
        </div>
      </Modal>
      <div className="mt-10">
        <Typography.Title level={3}>Users</Typography.Title>

        <Row justify="end" style={{ marginBottom: "1rem" }}>
          <Space>
            <Button type="primary" onClick={() => router.push({ pathname: "/users/add", query: { t: "system" } })} icon={<PlusOutlined />}>
              <span>Add</span>
            </Button>
            <Button type="primary" color="red" onClick={() => setIsDrawerVisible(true)} icon={<FilterOutlined />}>
              <span>Filter</span>
            </Button>
          </Space>
        </Row>

        <Table
          bordered
          size="small"
          loading={isLoading}
          columns={columns}
          dataSource={users.map((sk) => ({ ...sk, key: sk.id }))}
          pagination={{ pageSize, total }}
          scroll={{ x: true }}
          onChange={(e: any) => {
            setCurrentActivePage(e?.current);
            fetchUserList(e?.current);
          }}
        />

        <UserFilter isDrawerVisible={isDrawerVisible} setIsDrawerVisible={setIsDrawerVisible} submitFilter={submitFilter} form={form} />
      </div>
    </>
  );
}

interface IUserFilterProps {
  isDrawerVisible: boolean;
  setIsDrawerVisible: (value: boolean) => void;
  submitFilter: () => void;
  form: FormInstance;
}

function UserFilter(props: IUserFilterProps) {
  const resetFilters = () => {
    props.form.resetFields();
  };

  const submitFilter = () => {
    props.submitFilter();
  };

  return (
    <>
      <Drawer
        title="Filter"
        visible={props.isDrawerVisible}
        onClose={() => props.setIsDrawerVisible(false)}
        footer={
          <Row justify="end">
            <Space>
              <Button type="dashed" danger onClick={() => props.setIsDrawerVisible(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => {
                  resetFilters();
                  submitFilter();
                }}
              >
                Reset
              </Button>
              <Button type="primary" onClick={() => submitFilter()}>
                Apply
              </Button>
            </Space>
          </Row>
        }
      >
        <Form form={props.form} labelCol={{ span: 24 }}>
          <div>
            <Form.Item label="Search" name="search">
              <Input placeholder="Enter search filter" />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </>
  );
}
