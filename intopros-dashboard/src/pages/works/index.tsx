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
  Tag,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { makeRequest } from "../../utils/api";
import { removeHtmlTags } from "../../utils/utils";

function WorkList() {
  const router = useRouter();

  const [works, setWorks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterType, setFilterType] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [pagination, setPagination] = useState({
    perPage: 5,
    total: 0,
  });

  const updateWorkActiveStatus = (work: any) => {
    const formData = new FormData();
    formData.set("isActive", JSON.stringify(!work.isActive));

    makeRequest(`/works/${work.id}`, {
      method: "PATCH",
      data: formData,
    }).then((res) => {
      if (res) {
        notification.success({ message: "Work status updated successfully" });
        setWorks(
          works.map((b) => (b.id === res.data?.data?.id ? res.data?.data : b))
        );
      }
    });
  };

  const updateWorkStatus = (work: any) => {
    const formData = new FormData();
    formData.set("show", JSON.stringify(!work.show));

    makeRequest(`/works/${work.id}`, {
      method: "PATCH",
      data: formData,
    }).then((res) => {
      if (res) {
        notification.success({
          message: "Display status updated successfully",
        });
        setWorks(
          works.map((b) => (b.id === res.data?.data?.id ? res.data?.data : b))
        );
      }
    });
  };

  const deleteWork = async (id: number) => {
    const res = await makeRequest(`/works/${id}`, {
      method: "DELETE",
    });
    if (res) {
      notification.success({ message: "Successfully deleted work!" });
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
    params.set("status", "all");

    setIsLoading(true);
    const res = await makeRequest(`/works?${params.toString()}`);
    if (res) {
      setWorks(res.data?.data);
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
      <Typography.Title level={3}>works</Typography.Title>

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
              <Select
                defaultValue="all"
                style={{ minWidth: 128 }}
                options={[
                  { label: "All", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
                onChange={(value) => updateFilterType(value)}
              />

              <Button
                type="primary"
                onClick={() => router.push("/works/add")}
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
            {works.length < 1 && (
              <Typography.Title level={5}>No work found!</Typography.Title>
            )}
          </div>

          <Row gutter={10}>
            {works.map((work: any, index) => (
              <Col key={index} span={24} style={{ marginBottom: 10 }}>
                <Card
                  bodyStyle={{ padding: 15 }}
                  className="shadow"
                  title={
                    <Row justify="space-between">
                      <Col>
                        <Typography.Title level={3}>
                          {work.title}
                        </Typography.Title>
                      </Col>
                      <Col>
                        <Button
                          onClick={() => updateWorkActiveStatus(work)}
                          style={{ marginRight: "1rem" }}
                        >
                          {work.isActive ? "Active" : "Inactive"}
                        </Button>
                        <Button onClick={() => updateWorkStatus(work)}>
                          {work.show ? "Show in Homepage" : "Hide in Homepage"}
                        </Button>
                      </Col>
                    </Row>
                  }
                >
                  {/* Short Description of the work */}
                  <Typography.Paragraph>
                    <span>
                      {removeHtmlTags(work.shortDescription).substring(0, 500)}
                    </span>
                    <span>
                      <strong>...</strong>
                    </span>
                  </Typography.Paragraph>

                  <Divider style={{ marginTop: 10, marginBottom: 10 }} />

                  {/* Description of the work */}
                  <Typography.Paragraph>
                    <span>
                      {removeHtmlTags(work.description).substring(0, 500)}
                    </span>
                    <span>
                      <strong>...</strong>
                    </span>
                  </Typography.Paragraph>

                  <div>
                    <Space>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => router.push(`/works/${work.id}/edit`)}
                      >
                        Edit
                      </Button>

                      <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => deleteWork(work.id)}
                      >
                        Delete
                      </Button>
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

export default WorkList;
