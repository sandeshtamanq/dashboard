import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Space,
  Typography,
  Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getFileUrl, makeRequest } from "../../utils/api";
import { PlusOutlined } from "@ant-design/icons";

interface IProps {
  mode: "add" | "edit";
  defaultValues?: any;
}
export default function GalleryForm(props: IProps) {
  const router = useRouter();
  const [form] = useForm();

  const [galleryImages, setGalleryImages] = useState<any>([]);

  const uploadFile = async (file: any) => {
    const item = new FormData();
    item.set("image", file);

    const res = await makeRequest("/upload/image", {
      method: "POST",
      data: item,
    });

    return res?.data?.data?.image ?? "";
  };

  const resetValues = () => {
    if (props.mode === "add") {
      form.resetFields();
      setGalleryImages([]);
    } else {
      const images =
        props.defaultValues?.images?.map((img: any) => ({
          uid: img,
          name: img,
          status: "done",
          url: getFileUrl(img),
          isSaved: true,
        })) ?? [];

      form.setFieldsValue(props.defaultValues);
      setGalleryImages(images);
    }
  };

  const saveGalleryDetails = async (values: any) => {
    const newImgs = (galleryImages ?? []).filter((img: any) => !img.isSaved);
    const oldImgs = (galleryImages ?? []).filter((img: any) => img.isSaved);

    const imgList = [...oldImgs.map((img: any) => img.uid)];

    if (newImgs.length) {
      const newImgList = await Promise.all(
        newImgs.map((img: any) => uploadFile(img.xhr))
      );
      imgList.push(...newImgList);
    }

    makeRequest(
      props.mode === "add" ? "/gallery" : `/gallery/${router.query.id}`,
      {
        method: props.mode === "add" ? "POST" : "PATCH",
        data: {
          ...values,
          images: imgList,
        },
      }
    ).then((res) => {
      if (res) {
        const notificationMsg =
          props.mode === "add"
            ? "Successfully created Gallery Item"
            : "Succefully updated Gallery Item";

        notification.success({ message: notificationMsg });
        router.push("/gallery");
      }
    });
  };

  useEffect(() => {
    if (props.mode === "add") return;

    const images =
      props.defaultValues?.images?.map((img: any) => ({
        uid: img,
        name: img,
        status: "done",
        url: getFileUrl(img),
        isSaved: true,
      })) ?? [];

    form.setFieldsValue(props.defaultValues);
    setGalleryImages(images);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValues]);

  return (
    <Form
      labelCol={{ span: 24 }}
      form={form}
      onFinish={saveGalleryDetails}
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
          {props.mode === "add" ? "Add Gallery Item" : "Edit Gallery item"}
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
          <Form.Item name="link" label="Link">
            <Input placeholder="Enter the link" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Enter the description"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name={"images"} label="Image">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={true}
              multiple={true}
              fileList={galleryImages}
              onChange={(info) => {
                setGalleryImages(info.fileList);
              }}
              customRequest={(item: any) => item.onSuccess(null, item.file)}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
