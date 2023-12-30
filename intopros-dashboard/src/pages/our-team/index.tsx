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
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { makeRequest } from "../../utils/api";
import { removeHtmlTags } from "../../utils/utils";

function TeamList() {
  const router = useRouter();

  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterType, setFilterType] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [pagination, setPagination] = useState({
    perPage: 5,
    total: 0,
  });

  const updateteamstatus = (service: any) => {
    const formData = new FormData();
    formData.set("isActive", JSON.stringify(!service.isActive));

    makeRequest(`/our-team/${service.id}`, {
      method: "PATCH",
      data: formData,
    }).then((res) => {
      if (res) {
        notification.success({ message: "Team status updated successfully" });
        setTeams(
          teams.map((b) => (b.id === res.data?.data?.id ? res.data?.data : b))
        );
      }
    });
  };

  const deleteService = async (id: number) => {
    const res = await makeRequest(`/our-team/${id}`, {
      method: "DELETE",
    });
    if (res) {
      notification.success({ message: "Successfully deleted team!" });
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
    const res = await makeRequest(`/our-team?${params.toString()}`);
    if (res) {
      setTeams(res.data?.data);
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
      <Typography.Title level={3}>Our Team</Typography.Title>

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
                onClick={() => router.push("/our-team/add")}
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
            {teams.length < 1 && (
              <Typography.Title level={5}>No team found!</Typography.Title>
            )}
          </div>

          <Row gutter={10}>
            {teams.map((team: any, index) => (
              <Col key={index} span={24} style={{ marginBottom: 10 }}>
                <Card
                  bodyStyle={{ padding: 15 }}
                  className="shadow"
                  title={
                    <Row justify="space-between">
                      <Col>
                        <Typography.Title level={3}>
                          {team.name}
                        </Typography.Title>
                      </Col>
                      <Col>
                        <Button onClick={() => updateteamstatus(team)}>
                          {team.isActive ? "Active" : "Inactive"}
                        </Button>
                      </Col>
                    </Row>
                  }
                >
                  {/* Short Description of the Service */}
                  <Typography.Paragraph>
                    <span>
                      {removeHtmlTags(team.designation).substring(0, 500)}
                    </span>
                    <span>
                      <strong>...</strong>
                    </span>
                  </Typography.Paragraph>

                  <Divider style={{ marginTop: 10, marginBottom: 10 }} />

                  {/* Description of the Service */}
                  <Typography.Paragraph>
                    <span>
                      {removeHtmlTags(team.linkedin).substring(0, 500)}
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
                        onClick={() => router.push(`/our-team/${team.id}/edit`)}
                      >
                        Edit
                      </Button>

                      <Popconfirm
                        placement="right"
                        title={"Are you sure you want to delete this?"}
                        onConfirm={() => deleteService(team.id)}
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

export default TeamList;
