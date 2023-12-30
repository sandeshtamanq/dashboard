import {
  Button,
  Card,
  Col,
  Divider,
  notification,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { makeRequest } from "../../utils/api";
import dayjs from "dayjs";
import { removeHtmlTags } from "../../utils/utils";

function TechnologyList() {
  const router = useRouter();

  const [technologies, setTechnologies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterType, setFilterType] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [pagination, setPagination] = useState({
    perPage: 5,
    total: 0,
  });

  const updateTechnologyStatus = (technology: any) => {
    const formData = new FormData();
    formData.set("isActive", JSON.stringify(!technology.isActive));

    makeRequest(`/technologies/${technology.id}`, {
      method: "PATCH",
      data: formData,
    }).then((res) => {
      if (res) {
        notification.success({
          message: "Technology status updated successfully",
        });
        setTechnologies(
          technologies.map((b) =>
            b.id === res.data?.data?.id ? res.data?.data : b
          )
        );
      }
    });
  };

  const deleteTechnology = async (id: number) => {
    const res = await makeRequest(`/technologies/${id}`, {
      method: "DELETE",
    });
    if (res) {
      notification.success({ message: "Successfully deleted technology!" });
      fetchItems(activePage);
    }
  };

  const updateFilterType = (type: string) => {
    setFilterType(type);
    fetchItems(undefined, type);
  };

  const fetchItems = async (pageNum?: number, filterBy?: string) => {
    if (pageNum) setActivePage(pageNum);
    const skipCount = ((pageNum ?? 1) - 1) * (pagination?.perPage ?? 10) ?? 0;

    const params = new URLSearchParams();
    params.set("take", (pagination?.perPage ?? 10).toString());
    params.set("skip", skipCount.toString());
    params.set("filterBy", filterBy ?? filterType);

    setIsLoading(true);
    const res = await makeRequest(`/technologies?${params.toString()}`);
    if (res) {
      setTechnologies(res.data?.data);
      setPagination({
        ...res.data?.pagination,
        currentPage: pageNum,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-10">
      <Typography.Title level={3}>Technologies</Typography.Title>

      <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
        <Row justify="space-between">
          <Col>
            <Pagination
              defaultCurrent={1}
              current={activePage}
              total={pagination?.total}
              pageSize={pagination?.perPage}
              onChange={(page) => fetchItems(page)}
            />
          </Col>

          <Col>
            <Space>
              <Button
                type="primary"
                onClick={() => router.push("/technologies/add")}
                icon={<PlusOutlined />}
              >
                <span>Add</span>
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <Spin></Spin>
        </div>
      ) : (
        <>
          <div style={{ textAlign: "center" }}>
            {technologies.length < 1 && (
              <Typography.Title level={5}>
                No technology found!
              </Typography.Title>
            )}
          </div>

          <Row gutter={10}>
            {technologies.map((technology: any, index) => (
              <Col key={index} span={24} style={{ marginBottom: 10 }}>
                <Card
                  bodyStyle={{ padding: 15 }}
                  className="shadow"
                  title={
                    <Row justify="space-between">
                      <Col>
                        <Typography.Title level={3}>
                          {technology.title}
                        </Typography.Title>
                      </Col>
                    </Row>
                  }
                >
                  <div>
                    {technology._tags?.map((tag: string, index: number) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </div>

                  {/* Description of the technology */}
                  <Typography.Paragraph>
                    <span>
                      {removeHtmlTags(technology.fullDescription).substring(
                        0,
                        500
                      )}
                    </span>
                    <span>
                      <strong>...</strong>
                    </span>
                  </Typography.Paragraph>

                  <Typography.Text>
                    <Space style={{ marginTop: 10 }}>
                      <span>Publish Date:</span>
                      {technology.publishedDate ? (
                        <span>
                          <strong>
                            {dayjs(technology.publishedDate)?.format(
                              "YYYY-MM-DD"
                            )}
                          </strong>
                        </span>
                      ) : (
                        "-"
                      )}
                    </Space>
                  </Typography.Text>

                  <Divider style={{ marginTop: 5, marginBottom: 10 }} />
                  <div>
                    <Space>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() =>
                          router.push(`/technologies/${technology.id}/edit`)
                        }
                      >
                        Edit
                      </Button>

                      <Popconfirm
                        placement="right"
                        title={"Are you sure you want to delete this?"}
                        onConfirm={() => deleteTechnology(technology.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="primary" danger size="small">
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  </div>
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
          onChange={(page) => fetchItems(page)}
        />
      </div>
    </div>
  );
}

export default TechnologyList;
