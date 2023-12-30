import { Col, Pagination, Row, Select, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { makeRequest } from "../../../utils/api";

function TrainingApplicationList() {
  const [applications, setCareers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterType, setFilterType] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [pagination, setPagination] = useState({
    perPage: 5,
    total: 0,
  });

  const updateFilterType = (type: string) => {
    setFilterType(type);
    fetchItems(undefined, type);
  };

  const fetchItems = async (pageNum?: number, filterBy?: string) => {
    try {
      setIsLoading(true);
      if (pageNum) setActivePage(pageNum);
      const skipCount = ((pageNum ?? 1) - 1) * (pagination?.perPage ?? 10) ?? 0;

      const params = new URLSearchParams();
      params.set("take", (pagination?.perPage ?? 10).toString());
      params.set("skip", skipCount.toString());
      params.set("filterBy", filterBy ?? filterType);

      const res = await makeRequest(
        `/trainings/application?${params.toString()}`
      );
      if (res) {
        setCareers(res.data?.data);
        setPagination({
          ...res.data?.pagination,
          currentPage: pageNum,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Subject",
      dataIndex: "subject",
    },
    {
      title: "Message",
      dataIndex: "message",
    },
  ];

  return (
    <div className="mt-10">
      <Typography.Title level={3}>Training Applications</Typography.Title>

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
      </div>

      <Table
        bordered
        size="small"
        pagination={false}
        loading={isLoading}
        columns={columns}
        dataSource={applications.map((sk) => ({ ...sk, key: sk.id }))}
        scroll={{ x: true }}
      />

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

export default TrainingApplicationList;
