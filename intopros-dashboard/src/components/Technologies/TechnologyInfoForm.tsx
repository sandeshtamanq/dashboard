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
export default function TechnologyInfoForm(props: IProps) {
  const router = useRouter();
  const [form] = useForm();

  const [uploadedImg, setUploadedImg] = useState<any>(false);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [technology, setTechnology] = useState<string | undefined>(undefined);
  const { Option } = Select;

  const [filterType, setFilterType] = useState("all");

  const resetValues = () => {
    if (props.mode === "add") {
      form.resetFields();
    } else {
      form.setFieldsValue(props.defaultValues);
      setDescription(props.defaultValues?.description);
      setTechnology(props.defaultValues?.technologies);
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

  const saveTechnologyInfoDetails = (values: any) => {
    const data = new FormData();
    data.set("description", description ?? "");
    data.set("title", values.title);
    data.set("technologies", technology ?? "");
    if (uploadedImg) {
      data.set("image", uploadedImg);
    }

    makeRequest(
      props.mode === "add"
        ? "/technologies/info"
        : `/technologies/info/${router.query.id}`,
      {
        method: props.mode === "add" ? "POST" : "PATCH",
        data: data,
      }
    ).then((res) => {
      if (res) {
        const notificationMsg =
          props.mode === "add"
            ? "Successfully created Technology Info"
            : "Succefully updated Technology Info";

        notification.success({ message: notificationMsg });
        router.push("/technologies/info");
      }
    });
  };

  useEffect(() => {
    fetchItems();
    if (props.mode === "add") return;

    form.setFieldsValue(props.defaultValues);
    if (props.defaultValues?.description) {
      setDescription(props.defaultValues.description);
    }
    if (props.defaultValues?.technologies) {
      setTechnology(props.defaultValues.technologies);
    }
  }, [props.defaultValues]);

  const handleChange = (value: any) => {
    setTechnology(value);
  };

  return (
    <Form
      labelCol={{ span: 24 }}
      form={form}
      onFinish={saveTechnologyInfoDetails}
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
            ? "Add Technology Info"
            : "Edit Technology Info"}
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

        {technologies.length > 0 && (
          <Col span={24}>
            <Form.Item
              label="Technology"
              name="technologies"
              rules={[
                {
                  required: true,
                  message: "Technology is required!",
                },
              ]}
            >
              {/* <Select
                defaultValue={
                  props.defaultValues?.technologies ?? "Select Technology"
                }
                onChange={handleChange}
              >
                {technologies.map((item, id) => {
                  return (
                    <Option value={item.title} key={id}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select> */}
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Select Technologies"
                onChange={handleChange}
              >
                {technologies.map((item, id) => {
                  return (
                    <Option value={item.title} key={id}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        )}

        <Form.Item name="image" label="Image">
          {/* Create fileupload component that accept jpg or png file only */}
          <FileUpload
            acceptedFileType="image/jpeg, image/png"
            handleChange={(data: any) => setUploadedImg(data)}
            image={props.defaultValues?.image}
          />
        </Form.Item>

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
