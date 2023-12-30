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
import FileUpload from "../Reusable/ImageUpload";

interface IProps {
  mode: "add" | "edit";
  defaultValues?: any;
}
export default function ClientForm(props: IProps) {
  const router = useRouter();
  const [form] = useForm();

  const [uploadedImg, setUploadedImg] = useState<any>(false);
  const [designation, setDesignation] = useState<string | undefined>(undefined);
  const [linkedin, setlinkedin] = useState<string>("");

  const resetValues = () => {
    if (props.mode === "add") {
      form.resetFields();
    } else {
      form.setFieldsValue(props.defaultValues);
      setDesignation(props.defaultValues?.designation);
      setlinkedin(props.defaultValues?.linkedin);
    }
  };

  const saveServiceDetails = (values: any) => {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("designation", designation ?? "");
    formData.set("linkedin", linkedin ?? "");
    if (uploadedImg) {
      formData.set("image", uploadedImg);
    }

    // return console.log(values, uploadedImg, isImageDeleted);

    makeRequest(props.mode === "add" ? "/our-client" : `/our-client/${router.query.id}`, {
      method: props.mode === "add" ? "POST" : "PATCH",
      data: formData,
    }).then((res) => {
      if (res) {
        const notificationMsg =
          props.mode === "add"
            ? "Successfully created Client"
            : "Succefully updated Client";

        notification.success({ message: notificationMsg });
        router.push("/our-clients");
      }
    });
  };

  useEffect(() => {
    if (props.mode === "add") return;

    form.setFieldsValue(props.defaultValues);
    if (props.defaultValues?.designation) {
      setDesignation(props.defaultValues.designation);
    }
    if (props.defaultValues?.linkedin) {
      setlinkedin(props.defaultValues.linkedin);
    }
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
          {props.mode === "add" ? "Add Client" : "Edit Client"}
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
          <Form.Item label="Designation" initialValue={designation}>
            <RichEditor
              modules={modules}
              formats={formats}
              value={designation ?? ""}
              onChange={setDesignation}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="linkedin"
            label="LinkedIn link"
          >
            <Input placeholder="Enter the Linkedin link" 
            value={linkedin}
            onChange={(e)=> setlinkedin(e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
