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
import FileUpload from "../Reusable/ImageUpload";

interface IProps {
  mode: "add" | "edit";
  defaultValues?: any;
}
export default function ServiceForm(props: IProps) {
  const router = useRouter();
  const [form] = useForm();

  const { Option } = Select;

  const [uploadedImg, setUploadedImg] = useState<any>(false);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [shortDescription, setShortDescription] = useState<string | undefined>(
    undefined
  );
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [tags, setTags] = useState<string>("");

  const resetValues = () => {
    if (props.mode === "add") {
      form.resetFields();
    } else {
      form.setFieldsValue(props.defaultValues);
      setDescription(props.defaultValues?.description);
      setShortDescription(props.defaultValues?.shortDescription);
    }
  };

  const fetchTechnologies = async () => {
    const res = await makeRequest(`/technologies?take=0`);
    if (res) {
      setTechnologies(res.data?.data);
    }
  };

  const saveServiceDetails = (values: any) => {
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("shortDescription", shortDescription ?? "");
    formData.set("description", description ?? "");
    formData.set("tags", tags ?? "");
    if (uploadedImg) {
      formData.set("image", uploadedImg);
    }

    // return console.log(values, uploadedImg, isImageDeleted);

    makeRequest(
      props.mode === "add" ? "/services" : `/services/${router.query.id}`,
      {
        method: props.mode === "add" ? "POST" : "PATCH",
        data: formData,
      }
    ).then((res) => {
      if (res) {
        const notificationMsg =
          props.mode === "add"
            ? "Successfully created Services"
            : "Succefully updated Services";

        notification.success({ message: notificationMsg });
        router.push("/services");
      }
    });
  };

  const handleChange = (value: string) => {
    setTags(value);
  };

  useEffect(() => {
    fetchTechnologies();
    if (props.mode === "add") return;

    form.setFieldsValue(props.defaultValues);
    if (props.defaultValues?.shortDescription) {
      setShortDescription(props.defaultValues.shortDescription);
    }
    if (props.defaultValues?.description) {
      setDescription(props.defaultValues.description);
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
          {props.mode === "add" ? "Add Service" : "Edit Service"}
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
          <Form.Item name="tags" label="Tags">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              onChange={handleChange}
            >
              {technologies.map((item, index) => {
                return (
                  <Option key={index} value={item.title}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
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
          <Form.Item label="Description" initialValue={description}>
            <RichEditor
              modules={modules}
              formats={formats}
              value={description ?? ""}
              onChange={setDescription}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
