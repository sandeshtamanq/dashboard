import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
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
export default function TechnologyHiringMenuForm(props: IProps) {
  const router = useRouter();
  const [form] = useForm();

  const [description, setDescription] = useState<string>("");

  const resetValues = () => {
    if (props.mode === "add") {
      form.resetFields();
    } else {
      form.setFieldsValue(props.defaultValues);
    }
  };

  const saveTechnologyMenuDetails = (values: any) => {
    const data = {
      title: values.title,
      description: description,
      working: values.workin,
      communication: values.communication,
      billing: values.billing,
    };

    makeRequest(
      props.mode === "add"
        ? "/technologies/hiring-menu"
        : `/technologies/hiring-menu/${router.query.id}`,
      {
        method: props.mode === "add" ? "POST" : "PATCH",
        data: data,
      }
    ).then((res) => {
      if (res) {
        const notificationMsg =
          props.mode === "add"
            ? "Successfully created Technology Hiring Menu"
            : "Succefully updated Technology Hiring Menu";

        notification.success({ message: notificationMsg });
        router.push("/technologies/hiring-menu");
      }
    });
  };

  useEffect(() => {
    if (props.mode === "add") return;

    form.setFieldsValue(props.defaultValues);
    if (props.defaultValues?.description) {
      setDescription(props.defaultValues?.description);
    }
  }, [props.defaultValues]);

  return (
    <Form
      labelCol={{ span: 24 }}
      form={form}
      onFinish={saveTechnologyMenuDetails}
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
          {props.mode === "add"
            ? "Add Technology Hiring Menu"
            : "Edit Technology Hiring Menu"}
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
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: "Title is required!",
              },
            ]}
          >
            <Input placeholder="Enter the title" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Description" initialValue={description}>
            <RichEditor
              modules={modules}
              formats={formats}
              value={description ?? ""}
              onChange={setDescription}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="working"
            label="Working Hours"
            rules={[
              {
                required: true,
                message: "Working Hour is required!",
              },
            ]}
          >
            <Input placeholder="Enter the working hours per day" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="communication"
            label="Communication"
            rules={[
              {
                required: true,
                message: "Communication is required!",
              },
            ]}
          >
            <Input placeholder="Enter the Communication" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="billing"
            label="Billing"
            rules={[
              {
                required: true,
                message: "Billing is required!",
              },
            ]}
          >
            <Input placeholder="Enter the Billing" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
