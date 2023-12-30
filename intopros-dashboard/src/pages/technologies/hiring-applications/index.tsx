import {
  Col,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { getFileUrl, makeRequest } from "../../../utils/api";
import Column from "antd/lib/table/Column";

function HiringApplicationList() {

  const [applications, setApplications] = useState<any[]>([]);
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

      const res = await makeRequest(`/technologies/application?${params.toString()}`);
      if (res) {
        setApplications(res.data?.data);
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

  return (
    <div className="mt-10">
      <Typography.Title level={3}>Hiring Applications</Typography.Title>

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

      <Table loading={isLoading} dataSource={applications.map((sk) => ({ ...sk, key: sk.id }))}>
        <Column title="Name" dataIndex="name" />
        <Column title="Email" dataIndex="email" />
        <Column title="Technology" dataIndex="tech" />
        <Column title="Budget" dataIndex="budget" />
        <Column
          title="Package"
          render={(applications: any) => (
            <Space size="middle">
              <h5>{applications.package && applications.package.title}</h5>
            </Space>
          )}
        />
        <Column title="Requirements" dataIndex="message" />
        <Column
          title="File"
          render={(applications: any) => (
            <Space size="middle">
              <a href={getFileUrl(applications.file)} target="_blank" rel="noreferrer">{applications.file}</a>
            </Space>
          )}
        />
      </Table>

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

export default HiringApplicationList;
