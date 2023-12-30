import { Col, Pagination, Row, Select, Space, Spin, Table, Typography, Button, Modal, Form, Input, notification, PaginationProps } from "antd";
import { useEffect, useState } from "react";
import { getFileUrl, makeRequest } from "../../../utils/api";
import Column from "antd/lib/table/Column";
import dayjs from "dayjs";
import TextArea from "antd/lib/input/TextArea";

const SELECT_OPTIONS = [
  { label: "New", value: "new" },
  { label: "Good Fit", value: "goodFit" },
  { label: "Not Fit", value: "notFit" },
  { label: "Emailed", value: "emailed" },
  { label: "Interviewed", value: "interviewed" },
  { label: "Selected", value: "selected" },
  { label: "Rejected", value: "rejected" },
];

function CareerApplicationList() {
  const [applications, setCareers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [remarksModal, setRemarksModal] = useState(false);
  const [userApplication, setUserApplication] = useState<any>({});
  const [emailModal, setEmailModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [form] = Form.useForm();
  const [filterType, setFilterType] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [pagination, setPagination] = useState({
    perPage: 5,
    total: 0,
  });

  const [take, setTake] = useState(5);

  const updateFilterType = (type: string) => {
    setFilterType(type);
    fetchItems(undefined, type);
  };

  const fetchItems = async (pageNum?: number, filterBy?: string, search?: string) => {
    try {
      setIsLoading(true);
      if (pageNum) setActivePage(pageNum);
      const skipCount = ((activePage ?? 1) - 1) * (pagination?.perPage ?? 10) ?? 0;

      const params = new URLSearchParams();
      params.set("take", (take ?? 10).toString());
      params.set("skip", skipCount.toString());
      params.set("filterBy", filterBy ?? filterType);
      params.set("search", search ?? "");

      setIsLoading(true);
      const res = await makeRequest(`/careers/applications?${params.toString()}`);
      if (res) {
        setCareers(res.data?.data);
        setPagination({
          ...res.data?.pagination,
          currentPage: pageNum,
        });
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [take, activePage]);

  const updateApplicationStatus = async (value: string, id: number) => {
    const response = await makeRequest(`/careers/applications/${id}`, {
      method: "PATCH",
      data: { status: value },
    });
    if (response) {
      fetchItems(activePage);
      setUserApplication(response.data.data);
      notification.success({ message: "Status updated successfully", duration: 3 });
    }
  };

  const addRemark = (record: any) => {
    setUserApplication(record);
    form.setFieldsValue({ remark: record.remark });
    setRemarksModal(true);
  };

  const sendEmail = (record: any) => {
    setUserApplication(record);
    setEmailModal(true);
  };

  const handleRemarkOk = async (values: any) => {
    if (form.getFieldValue("remark") === undefined) {
      notification.error({
        message: "Remark filed cannot be empty",
        duration: 3,
      });
      return;
    }

    try {
      const response = await makeRequest(`/careers/applications/${userApplication.id}`, {
        method: "PATCH",
        data: { status: userApplication.status, remark: form.getFieldValue("remark") },
      });
      setCareers([]);
      if (response) {
        form.resetFields();
        fetchItems(activePage);
        setRemarksModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleRemarkCancel = () => {
    setRemarksModal(false);
  };

  const handleEmailCancel = () => {
    setEmailModal(false);
  };

  const handleEmailOk = async () => {
    setSendingEmail(true);
    const response = await makeRequest(`/careers/applications/email/${userApplication.id}`, {
      method: "POST",
      data: { emailBody: { subject: form.getFieldValue("subject"), to: userApplication.email, name: userApplication.name, body: form.getFieldValue("email") } },
    });
    if (response) {
      setCareers([]);
      notification.success({
        message: response.data.message,
        duration: 3,
      });
      fetchItems(activePage);
      setEmailModal(false);
      setSendingEmail(false);
    }
    form.resetFields();
  };
  const submitForm = (values: any) => {
    const { search } = values;
    fetchItems(undefined, undefined, search);
  };

  return (
    <>
      {/* remarks modal start */}
      <Modal
        title="Remarks"
        visible={remarksModal}
        onCancel={handleRemarkCancel}
        destroyOnClose
        footer={[
          <Button key="back" danger onClick={handleRemarkCancel}>
            Cancel
          </Button>,
          <Button key="submit" onClick={handleRemarkOk} type="primary">
            Save Remark
          </Button>,
        ]}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleRemarkOk}>
          <Form.Item name="remark">
            <TextArea name="remark" placeholder="Write Remark" />
          </Form.Item>
          <Select
            defaultValue={userApplication.status}
            style={{ width: "100%" }}
            options={SELECT_OPTIONS}
            onChange={(value) =>
              setUserApplication((preval: any) => {
                return { ...preval, status: value };
              })
            }
          />
        </Form>
      </Modal>
      {/* remarks modal end */}

      {/* email modal start */}
      <Modal
        title="Email"
        visible={emailModal}
        onCancel={handleEmailCancel}
        destroyOnClose
        footer={[
          <Button key="back" danger onClick={handleEmailCancel}>
            Cancel
          </Button>,
          <Button key="submit" onClick={handleEmailOk}>
            {sendingEmail ? <Spin /> : "Send Email"}
          </Button>,
        ]}
      >
        <div style={{ marginBottom: "20px" }}>to:{userApplication?.email}</div>
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleRemarkOk}>
          <Form.Item name="subject" label="Subject:">
            <Input name="subject" placeholder="Write Subject" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <TextArea name="email" placeholder="Write Email" rows={5} />
          </Form.Item>
        </Form>
      </Modal>
      {/* remarks modal end */}

      <div className="mt-10">
        <Typography.Title level={3}>Career Applications</Typography.Title>

        <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
          <Row justify="space-between">
            <Col>
              <Pagination
                showSizeChanger
                onShowSizeChange={(current, pageSize) => setTake(pageSize)}
                defaultCurrent={1}
                current={activePage}
                total={pagination?.total}
                pageSize={pagination?.perPage}
                onChange={(page) => setActivePage(page)}
              />
            </Col>
            <Col>
              <Row justify="space-between">
                <Form labelCol={{ span: 24 }} onFinish={submitForm}>
                  <Form.Item name="search">
                    <Input placeholder="Enter search filter" />
                  </Form.Item>
                </Form>
                <Col>
                  <Select defaultValue="all" style={{ minWidth: 128 }} options={[{ label: "All", value: "all" }, ...SELECT_OPTIONS]} onChange={(value) => updateFilterType(value)} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <Table pagination={false} loading={isLoading} dataSource={applications.map((sk) => ({ ...sk, key: sk.id }))}>
          <Column title="Name" dataIndex="name" />
          <Column title="Email" dataIndex="email" />
          <Column
            title="Position"
            render={(applications: any) => (
              <Space size="middle">
                <h5>{applications.position && applications.position.title}</h5>
              </Space>
            )}
          />
          <Column title="Cover Letter" dataIndex="coverLetter" />
          <Column
            dataIndex="status"
            title="Status"
            render={(status, record: any) => {
              return (
                <>
                  <Select
                    defaultValue={status}
                    style={{ minWidth: 128 }}
                    options={SELECT_OPTIONS}
                    onChange={(value) => {
                      updateApplicationStatus(value, record.id);
                    }}
                  />
                </>
              );
            }}
          />
          <Column
            title="CV"
            render={(applications: any) => (
              <Space size="middle">
                <a href={getFileUrl(applications.file)} target="_blank" rel="noreferrer">
                  Link
                </a>
              </Space>
            )}
          />
          <Column
            title="Actions"
            width={"100px"}
            render={(_: any, record: any) => (
              <Row justify="space-between">
                <Col style={{ margin: "5px 0" }}>
                  <Button style={{ width: "79px" }} type="primary" onClick={() => addRemark(record)}>
                    Remark
                  </Button>
                </Col>
                <Col>
                  <Button style={{ width: "79px" }} danger onClick={() => sendEmail(record)}>
                    Email
                  </Button>
                </Col>
              </Row>
            )}
          />

          <Column
            title="Date"
            width={"120px"}
            render={(row: any) => (
              <Space size="middle">
                <p>{dayjs(row.createdAt)?.format("YYYY-MM-DD")}</p>
              </Space>
            )}
          />
        </Table>

        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <Pagination defaultCurrent={1} current={activePage} total={pagination?.total} pageSize={pagination?.perPage} onChange={(page) => fetchItems(page)} />
        </div>
      </div>
    </>
  );
}

export default CareerApplicationList;
