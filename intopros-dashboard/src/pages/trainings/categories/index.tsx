import {
  Button,
  Card,
  Col,
  notification,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { makeRequest } from "../../../utils/api";

function TrainingCategoryList() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterType, setFilterType] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [pagination, setPagination] = useState({
    perPage: 5,
    total: 0,
  });

  const updateCareerCategoryStatus = (category: any) => {
    const data = {
      isActive: JSON.stringify(!category.isActive),
    };

    makeRequest(`/trainings/category/${category.id}`, {
      method: "PATCH",
      data,
    }).then((res) => {
      if (res) {
        notification.success({
          message: "Training category updated successfully",
        });
        setCategories(
          categories.map((b) =>
            b.id === res.data?.data?.id ? res.data?.data : b
          )
        );
      }
    });
  };

  const deleteCategory = async (id: number) => {
    const res = await makeRequest(`/trainings/category/${id}`, {
      method: "DELETE",
    });
    if (res) {
      notification.success({ message: "Successfully deleted category!" });
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
    const res = await makeRequest(`/trainings/category?${params.toString()}`);
    if (res) {
      setCategories(res.data?.data);
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
      <Typography.Title level={3}>Training Categories</Typography.Title>

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
                onClick={() => router.push("/trainings/categories/add")}
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
            {categories.length < 1 && (
              <Typography.Title level={5}>No category found!</Typography.Title>
            )}
          </div>

          <Row gutter={10}>
            {categories.map((category: any, index) => (
              <Col key={index} span={24} style={{ marginBottom: 10 }}>
                <Card
                  bodyStyle={{ padding: 15 }}
                  className="shadow"
                  title={
                    <Row justify="space-between">
                      <Col>
                        <Typography.Title level={3}>
                          {category.category}
                        </Typography.Title>
                      </Col>
                      <Col>
                        <Button
                          onClick={() => updateCareerCategoryStatus(category)}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Button>
                      </Col>
                    </Row>
                  }
                >
                  <div>
                    <Space>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() =>
                          router.push(
                            `/trainings/categories/${category.id}/edit`
                          )
                        }
                      >
                        Edit
                      </Button>

                      <Popconfirm
                        placement="right"
                        title={"Are you sure you want to delete this?"}
                        onConfirm={() => deleteCategory(category.id)}
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

export default TrainingCategoryList;
