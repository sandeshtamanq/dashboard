import {
  Button,
  Col,
  DatePicker,
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
import moment from "moment";

interface IProps {
  mode: "add" | "edit";
  defaultValues?: any;
}
export default function BlogForm(props: IProps) {
  const router = useRouter();
  const [form] = useForm();

  const [uploadedImg, setUploadedImg] = useState<any>(false);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  const [filterType, setFilterType] = useState("all");
  const { Option } = Select;

  const resetValues = () => {
    if (props.mode === "add") {
      form.resetFields();
    } else {
      form.setFieldsValue(props.defaultValues);
      setDescription(props.defaultValues?.description);
      setCategory(props.defaultValues?.category);
    }
  };

  const fetchCategory = async () => {
    const params = new URLSearchParams();
    params.set("filterBy", filterType);
    params.set("take", "0");

    const res = await makeRequest(`/blogs/category?${params.toString()}`);
    if (res) {
      setCategoryData(res.data?.data);
    }
  };

  const saveBlogDetails = (values: any) => {
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("category", values.category);
    formData.set("description", description ?? "");
    formData.set("tags", values.tags);
    formData.set("publishDate", values.publishDate.format());
    formData.set("metaDescription", values.metaDescription);
    if (uploadedImg) {
      formData.set("image", uploadedImg);
    }

    // return console.log(values, uploadedImg, isImageDeleted);

    makeRequest(props.mode === "add" ? "/blogs" : `/blogs/${router.query.id}`, {
      method: props.mode === "add" ? "POST" : "PATCH",
      data: formData,
    }).then((res) => {
      if (res) {
        const notificationMsg =
          props.mode === "add"
            ? "Successfully created Blog"
            : "Succefully updated Blog";

        notification.success({ message: notificationMsg });
        router.push("/blogs");
      }
    });
  };

  useEffect(() => {
    fetchCategory();
    if (props.mode === "add") return;

    form.setFieldsValue(props.defaultValues);
    if (props.defaultValues?.publishedDate) {
      form.setFieldsValue({
        publishDate: moment(props.defaultValues?.publishedDate),
      });
    }
    if (props.defaultValues?.description) {
      setDescription(props.defaultValues.description);
    }
    if (props.defaultValues?.category) {
      setCategory(props.defaultValues.category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValues]);

  const handleChange = (value: any) => {
    setCategory(value);
  };

  return (
    <Form
      labelCol={{ span: 24 }}
      form={form}
      onFinish={saveBlogDetails}
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
          {props.mode === "add" ? "Add Blog" : "Edit Blog"}
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
          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message: "Category is required!",
              },
            ]}
          >
            <Select
              defaultValue="Select Category"
              style={{
                width: 220,
              }}
              onChange={handleChange}
            >
              {categoryData.map((item, id) => {
                return (
                  <Option value={item.category} key={id}>
                    {item.category}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Enter tags" notFoundContent={""} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="publishDate"
            label="Publish Date"
            rules={[{ required: true, message: "Publish Date is required!" }]}
          >
            <DatePicker
              allowClear={false}
              placeholder="Enter publish date"
              style={{ width: "100%" }}
            />
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
          <Form.Item label="Meta Description (SEO)" name="metaDescription">
            <Input
              showCount
              maxLength={256}
              placeholder="Enter the meta description to be used for SEO"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
