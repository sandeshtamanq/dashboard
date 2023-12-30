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
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { makeRequest } from "../../utils/api";
import { removeHtmlTags } from "../../utils/utils";

function BlogList() {
  const router = useRouter();

  const [cmsList, setCmsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterType, setFilterType] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [pagination, setPagination] = useState({
    perPage: 5,
    total: 0,
  });

  const updateCMSStatus = async (cmsItem: any) => {
    const res = await makeRequest(`/cms/${cmsItem.id}`, {
      method: "PATCH",
      data: {
        title: cmsItem.title,
        description: cmsItem.description,
        isActive: !cmsItem.isActive,
      },
    });
    if (res) {
      notification.success({
        message: "Successfully updated status of CMS page",
      });
      fetchItems(activePage, filterType);
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
    const res = await makeRequest(`/cms?${params.toString()}`);
    if (res) {
      setCmsList(res.data?.data);
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
      <Typography.Title level={3}>CMS Pages</Typography.Title>

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
            <Space size="large">
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
                onClick={() => router.push("/cms/add")}
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
            {cmsList.length < 1 && (
              <Typography.Title level={5}>No CMS page found!</Typography.Title>
            )}
          </div>

          <Row gutter={10}>
            {cmsList.map((cms: any, index) => (
              <Col key={index} span={24} style={{ marginBottom: 10 }}>
                <Card
                  bodyStyle={{ padding: 15 }}
                  className="shadow"
                  title={
                    <Row justify="space-between">
                      <Col>
                        <Typography.Title level={3}>
                          {cms.title}
                        </Typography.Title>
                      </Col>
                      <Col>
                        <Button onClick={() => updateCMSStatus(cms)}>
                          {cms.isActive ? "Active" : "Inactive"}
                        </Button>
                      </Col>
                    </Row>
                  }
                >
                  {/* Description of the blog */}
                  <Typography.Paragraph>
                    <span>
                      {removeHtmlTags(cms.description).substring(0, 500)}
                    </span>
                    <span>
                      <strong>...</strong>
                    </span>
                  </Typography.Paragraph>

                  <Divider style={{ marginTop: 5, marginBottom: 10 }} />
                  <div>
                    <Space>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => router.push(`/cms/${cms.id}/edit`)}
                      >
                        Edit
                      </Button>

                      {/* <Button
                    type="primary"
                    danger
                    size="small"
                    onClick={() => deleteBlog(cms.id)}
                  >
                    Delete
                  </Button> */}
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

export default BlogList;
