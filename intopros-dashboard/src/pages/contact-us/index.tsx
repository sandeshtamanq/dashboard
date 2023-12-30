import {
  Button,
  Card,
  Col,
  Divider,
  notification,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { getFileUrl, makeRequest } from "../../utils/api";

function BlogList() {
  const [contactItems, setContactItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterType, setFilterType] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [pagination, setPagination] = useState({
    perPage: 5,
    total: 0,
  });

  const updateBlogStatus = async (item: any) => {
    if (item.isResolved) return;

    const res = await makeRequest(`/contact-us/${item.id}`, {
      method: "PATCH",
    });
    if (res) {
      notification.success({ message: res.data.message });
      setContactItems(
        contactItems.map((b) =>
          b.id === res.data?.data?.id ? res.data?.data : b
        )
      );
    }
  };

  const updateFilterType = (type: string) => {
    setFilterType(type);
    fetchContactMessages(undefined, type);
  };

  const fetchContactMessages = async (
    pageNumber?: number,
    filterTypeTemp?: string
  ) => {
    if (pageNumber) setActivePage(pageNumber);
    const skipCount =
      ((pageNumber ?? 1) - 1) * (pagination?.perPage ?? 10) ?? 0;

    const params = new URLSearchParams();
    params.set("take", (pagination?.perPage ?? 10).toString());
    params.set("skip", skipCount.toString());
    params.set("filterBy", filterTypeTemp ?? filterType);

    setIsLoading(true);
    const res = await makeRequest(`/contact-us?${params.toString()}`);
    if (res) {
      setContactItems(res.data?.data);
      setPagination({
        ...res.data?.pagination,
        currentPage: pageNumber,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContactMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-10">
      <Typography.Title level={3}>Contact us Messages</Typography.Title>

      <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
        <Row justify="space-between">
          <Col>
            <Pagination
              defaultCurrent={1}
              current={activePage}
              total={pagination?.total}
              pageSize={pagination?.perPage}
              onChange={(page) => fetchContactMessages(page)}
            />
          </Col>
          <Col>
            <Select
              defaultValue="all"
              style={{ minWidth: 128 }}
              options={[
                { label: "All", value: "all" },
                { label: "Resolved", value: "resolved" },
                { label: "Not Resolved", value: "notResolved" },
              ]}
              onChange={(value) => updateFilterType(value)}
            />
          </Col>
        </Row>

        <div style={{ textAlign: "center" }}>
          {contactItems.length < 1 && (
            <Typography.Title level={5}>
              No contact message found!
            </Typography.Title>
          )}
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <Spin></Spin>
        </div>
      ) : (
        <>
          <Row gutter={10}>
            {contactItems.map((item: any, index) => (
              <Col key={index} span={24} style={{ marginBottom: 10 }}>
                <Card
                  bodyStyle={{ padding: 15 }}
                  className="shadow"
                  title={
                    <Row justify="space-between">
                      <Col>
                        <Typography.Title level={3} style={{ marginBottom: 0 }}>
                          {item.name}
                        </Typography.Title>
                        <small>
                          <Space>
                            <Typography.Text>{item.email}</Typography.Text>
                          </Space>
                        </small>
                      </Col>
                      <Col>
                        <Button
                          onClick={() => updateBlogStatus(item)}
                          disabled={item.isResolved}
                          type="primary"
                        >
                          {item.isResolved ? "Resolved" : "Not Resolved"}
                        </Button>
                      </Col>
                    </Row>
                  }
                >
                  <Col>
                    <Typography.Text>
                      <Space>
                        <span>Technology:</span>
                        <span>
                          <strong>{item.tech}</strong>
                        </span>
                      </Space>
                    </Typography.Text>
                    <br></br>
                    <Typography.Text>
                      <Space>
                        <span>Budget:</span>
                        <span>
                          <strong>{item.budget}</strong>
                        </span>
                      </Space>
                    </Typography.Text>
                    <br></br>
                    {item.message && (
                      <Typography.Paragraph>
                        <span>Requirements: </span>
                        <span>
                          <strong>{item.message}</strong>
                        </span>
                      </Typography.Paragraph>
                    )}
                    <br></br>
                    {item.file && (
                      <Typography.Text>
                        <Space>
                          <span>File:</span>
                          <span>
                            <a
                              href={getFileUrl(item.file)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Click to View
                            </a>
                          </span>
                        </Space>
                      </Typography.Text>
                    )}
                  </Col>
                  <Col>
                    <Typography.Text>
                      <Space>
                        <span>Received At:</span>
                        <span>
                          <strong>
                            {dayjs(item.createdAt).format("YYYY-MM-DD")}
                          </strong>
                        </span>
                      </Space>
                    </Typography.Text>
                  </Col>

                  <br />

                  {item.isResolved && (
                    <Col>
                      <Space size="large">
                        <Typography.Text>
                          <Space>
                            <span>Resolved At:</span>
                            <span>
                              <strong>
                                {dayjs(item.resolvedAt)?.format("YYYY-MM-DD")}
                              </strong>
                            </span>
                          </Space>
                        </Typography.Text>
                        {/* <br /> */}

                        <Typography.Text>
                          <Space>
                            <span>Resolved By:</span>
                            <span>
                              <strong>{item.resolvedBy?.email}</strong>
                            </span>
                          </Space>
                        </Typography.Text>
                      </Space>
                    </Col>
                  )}
                  <Divider style={{ marginTop: 15, marginBottom: 10 }} />

                  {/* Description of the blog */}
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <Pagination
          defaultCurrent={1}
          current={activePage}
          total={pagination?.total}
          pageSize={pagination?.perPage}
          onChange={(page) => fetchContactMessages(page)}
        />
      </div>
    </div>
  );
}

export default BlogList;
