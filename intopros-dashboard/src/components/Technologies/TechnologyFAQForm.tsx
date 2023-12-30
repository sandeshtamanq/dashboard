import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Rich text editor
import RichEditor, { formats, modules } from "../Reusable/RichEditor";

import { makeRequest } from "../../utils/api";

interface IProps {
  mode: "add" | "edit";
  defaultValues?: any;
}
export default function TechnologyFAQForm(props: IProps) {
  const router = useRouter();
  const [form] = useForm();

  const [answer, setAnswer] = useState<string | "">("");
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [technology, setTechnology] = useState<string>("");
  const [techID, setTechID] = useState<string>("");
  const { Option } = Select;

  const [filterType, setFilterType] = useState("all");

  const resetValues = () => {
    if (props.mode === "add") {
      form.resetFields();
    } else {
      form.setFieldsValue(props.defaultValues);
    }
  };

  const fetchItems = async (filterBy?: string) => {
    const params = new URLSearchParams();
    params.set("filterBy", filterBy ?? filterType);
    params.set("take", "0");

    const res = await makeRequest(`/technologies?${params.toString()}`);
    if (res) {
      setTechnologies(res.data?.data);
    }
  };

  const saveTechnologyFAQDetails = (values: any) => {
    const data = new FormData();
    data.set("answer", answer);
    data.set("question", values.question);
    data.set("techID", techID);

    makeRequest(
      props.mode === "add"
        ? "/technologies/faq"
        : `/technologies/faq/${router.query.id}`,
      {
        method: props.mode === "add" ? "POST" : "PATCH",
        data: data,
      }
    ).then((res) => {
      if (res) {
        const notificationMsg =
          props.mode === "add"
            ? "Successfully created Technology FAQ"
            : "Succefully updated Technology FAQ";

        notification.success({ message: notificationMsg });
        router.push("/technologies/FAQ");
      }
    });
  };

  useEffect(() => {
    fetchItems();
    if (props.mode === "add") return;

    form.setFieldsValue(props.defaultValues);
    if (props.defaultValues?.technology) {
      setTechnology(props.defaultValues?.technology);
      setTechID(props.defaultValues?.belongsTo.id);
    }
    if (props.defaultValues?.answer) {
      setAnswer(props.defaultValues?.answer);
    }
  }, [props.defaultValues]);

  const handleChange = (value: any) => {
    setTechID(value);
  };

  return (
    <Form
      labelCol={{ span: 24 }}
      form={form}
      onFinish={saveTechnologyFAQDetails}
      onFinishFailed={() => {
        notification.error({
          message:
            "Please fill all the required fields and make sure they are valid!",
        });
      }}
      style={{ paddingBottom: "1rem" }}
      scrollToFirstError
    >
      <Row justify="space-between" align="middle" className="action-bar">
        <Typography.Title level={3}>
          {props.mode === "add" ? "Add Technology FAQ" : "Edit Technology FAQ"}
        </Typography.Title>

        <div>
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button type="primary" danger onClick={resetValues}>
              Reset
            </Button>
          </Space>
        </div>
      </Row>

      <Row gutter={10}>
        <Col span={24}>
          <Form.Item
            name="question"
            label="Question"
            rules={[
              {
                required: true,
                message: "Question is required!",
              },
            ]}
          >
            <Input placeholder="Enter the Question" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Answer" initialValue={answer}>
            <RichEditor
              modules={modules}
              formats={formats}
              value={answer ?? ""}
              onChange={setAnswer}
            />
          </Form.Item>
        </Col>

        {technologies.length > 0 && (
          <Col span={24}>
            <Form.Item
              label="Technology"
              name="technology"
              rules={[
                {
                  required: true,
                  message: "Technology is required!",
                },
              ]}
            >
              <Select
                defaultValue={
                  props.defaultValues?.technology ?? "Select Technology"
                }
                onChange={handleChange}
              >
                {technologies.map((item, id) => {
                  return (
                    <Option value={item.id} key={id}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
}
