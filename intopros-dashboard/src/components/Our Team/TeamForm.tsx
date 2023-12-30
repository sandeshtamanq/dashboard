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
import { makeRequest } from "../../utils/api";
import FileUpload from "../Reusable/ImageUpload";

interface IProps {
  mode: "add" | "edit";
  defaultValues?: any;
}
export default function TeamForm(props: IProps) {
  const router = useRouter();
  const [form] = useForm();

  const [uploadedImg, setUploadedImg] = useState<any>(false);

  const resetValues = () => {
    if (props.mode === "add") {
      form.resetFields();
    } else {
      form.setFieldsValue(props.defaultValues);
    }
  };

  const saveServiceDetails = (values: any) => {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("designation", values.designation);
    formData.set("linkedin", values.linkedin);
    if (uploadedImg) {
      formData.set("image", uploadedImg);
    }

    // return console.log(values, uploadedImg, isImageDeleted);

    makeRequest(
      props.mode === "add" ? "/our-team" : `/our-team/${router.query.id}`,
      {
        method: props.mode === "add" ? "POST" : "PATCH",
        data: formData,
      }
    ).then((res) => {
      if (res) {
        const notificationMsg =
          props.mode === "add"
            ? "Successfully created Team"
            : "Succefully updated Team";

        notification.success({ message: notificationMsg });
        router.push("/our-team");
      }
    });
  };

  useEffect(() => {
    if (props.mode === "add") return;

    form.setFieldsValue(props.defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValues]);

  return (
    <Form
      labelCol={{ span: 24 }}
      form={form}
      onFinish={saveServiceDetails}
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
          {props.mode === "add" ? "Add Team" : "Edit Team"}
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
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Name is required!",
              },
            ]}
          >
            <Input placeholder="Enter the name" />
          </Form.Item>
        </Col>

        <Form.Item name="image" label="Image">
          {/* Create fileupload component that accept jpg or png file only */}
          <FileUpload
            acceptedFileType="image/jpeg, image/png"
            handleChange={(data: any) => setUploadedImg(data)}
            image={props.defaultValues?.image}
          />
        </Form.Item>

        <Col span={24}>
          <Form.Item
            name="designation"
            label="Designation"
            rules={[
              {
                required: true,
                message: "Designation is required!",
              },
            ]}
          >
            <Input placeholder="Enter the designation" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="linkedin" label="LinkedIn link">
            <Input placeholder="Enter the Linkedin link" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
