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
export default function TechnologyForm(props: IProps) {
  const router = useRouter();
  const [form] = useForm();

  const [uploadedImg, setUploadedImg] = useState<any>(false);
  const [shortDescription, setShortDescription] = useState<string | undefined>(
    undefined
  );
  const [fullDescription, setFullDescription] = useState<string | undefined>(
    undefined
  );

  const resetValues = () => {
    if (props.mode === "add") {
      form.resetFields();
    } else {
      form.setFieldsValue(props.defaultValues);
      setShortDescription(props.defaultValues?.shortDescription);
      setFullDescription(props.defaultValues?.fullDescription);
    }
  };

  const saveTechnologyDetails = (values: any) => {
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("shortDescription", shortDescription ?? "");
    formData.set("fullDescription", fullDescription ?? "");
    if (uploadedImg) {
      formData.set("image", uploadedImg);
    }

    // return console.log(values, uploadedImg, isImageDeleted);

    makeRequest(
      props.mode === "add"
        ? "/technologies"
        : `/technologies/${router.query.id}`,
      {
        method: props.mode === "add" ? "POST" : "PATCH",
        data: formData,
      }
    ).then((res) => {
      if (res) {
        const notificationMsg =
          props.mode === "add"
            ? "Successfully created Technology"
            : "Succefully updated Technology";

        notification.success({ message: notificationMsg });
        router.push("/technologies");
      }
    });
  };

  useEffect(() => {
    if (props.mode === "add") return;

    form.setFieldsValue(props.defaultValues);
    if (props.defaultValues?.shortDescription) {
      setShortDescription(props.defaultValues.shortDescription);
    }
    if (props.defaultValues?.fullDescription) {
      setFullDescription(props.defaultValues.fullDescription);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValues]);

  return (
    <Form
      labelCol={{ span: 24 }}
      form={form}
      onFinish={saveTechnologyDetails}
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
          {props.mode === "add" ? "Add Technology" : "Edit Technology"}
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

        <Form.Item name="image" label="Image">
          {/* Create fileupload component that accept jpg or png file only */}
          <FileUpload
            acceptedFileType="image/jpeg, image/png"
            handleChange={(data: any) => setUploadedImg(data)}
            image={props.defaultValues?.image}
          />
        </Form.Item>

        <Col span={24}>
          <Form.Item label="Short Description" initialValue={shortDescription}>
            <RichEditor
              modules={modules}
              formats={formats}
              value={shortDescription ?? ""}
              onChange={setShortDescription}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Full Description" initialValue={fullDescription}>
            <RichEditor
              modules={modules}
              formats={formats}
              value={fullDescription ?? ""}
              onChange={setFullDescription}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
