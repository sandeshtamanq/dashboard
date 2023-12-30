import {
  Button,
  Card,
  Col,
  Divider,
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

// Rich text editor
import RichEditor, { formats, modules } from "../Reusable/RichEditor";

import { getFileUrl, makeRequest } from "../../utils/api";
import { PlusOutlined } from "@ant-design/icons";

interface IProps {
  mode: "add" | "edit";
  defaultValues?: any;
}
export default function CmsForm(props: IProps) {
  const router = useRouter();
  const [form] = useForm();

  // const [uploadedImg, setUploadedImg] = useState<any>(false);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [childDescriptions, setChildDescriptions] = useState<any>({});

  const [image, setImage] = useState<any>(undefined);
  const [childImages, setChildImages] = useState<any>({});

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
    setImage(undefined);
    setChildImages({});

    if (props.mode === "add") {
      form.resetFields();
    } else {
      form.setFieldsValue(props.defaultValues);
      setDescription(props.defaultValues?.description);

      if (props.defaultValues?.image) {
        setImage([
          {
            uid: props.defaultValues.image,
            name: props.defaultValues.image,
            status: "done",
            url: getFileUrl(props.defaultValues.image),
            isSaved: true,
          },
        ]);
      }

      props.defaultValues?.children?.forEach((item: any, index: number) => {
        setChildDescriptions((prevState: any) => ({
          ...prevState,
          [index]: item.description,
        }));

        if (item.image) {
          setChildImages((prevState: any) => ({
            ...prevState,
            [index]: item.image
              ? [
                  {
                    uid: item.image,
                    name: item.image,
                    status: "done",
                    url: getFileUrl(item.image),
                    isSaved: true,
                  },
                ]
              : [],
          }));
        }
      });
    }
  };

  const saveCmsDetails = async (values: any) => {
    let imgUrl: string | null = null;
    if (image?.length > 0) {
      if (image?.[0]?.isSaved) {
        imgUrl = image?.[0]?.uid;
      } else {
        imgUrl = await uploadFile(image?.[0]?.originFileObj);
      }
    }

    const childrenData: any[] = [];
    for (let i = 0; i < values.children?.length; i++) {
      const child = values.children?.[i];

      let childImgUrl: string | null = null;
      if (childImages[i]?.length > 0) {
        if (childImages[i]?.[0]?.isSaved) {
          childImgUrl = childImages[i]?.[0]?.uid;
        } else {
          childImgUrl = await uploadFile(childImages[i]?.[0]?.originFileObj);
        }
      }
      childrenData.push({
        ...(child.id ? { id: child.id } : {}),
        slug: child.slug,
        title: child.title,
        description: childDescriptions[i],
        image: childImgUrl,
      });
    }

    const data = {
      ...values,
      description: description,
      image: imgUrl,
      children: childrenData,
    };

    makeRequest(props.mode === "add" ? "/cms" : `/cms/${router.query.id}`, {
      method: props.mode === "add" ? "POST" : "PATCH",
      data,
    }).then((res) => {
      if (res) {
        const notificationMsg =
          props.mode === "add"
            ? "Successfully created CMS page"
            : "Succefully updated CMS page";

        notification.success({ message: notificationMsg });
        router.push("/cms");
      }
    });
  };

  useEffect(() => {
    if (props.mode === "add") return;

    form.setFieldsValue(props.defaultValues);
    if (props.defaultValues?.description) {
      setDescription(props.defaultValues.description);
    }
    if (props.defaultValues?.image) {
      setImage([
        {
          uid: props.defaultValues.image,
          name: props.defaultValues.image,
          status: "done",
          url: getFileUrl(props.defaultValues.image),
          isSaved: true,
        },
      ]);
    }

    props.defaultValues?.children?.forEach((item: any, index: number) => {
      setChildDescriptions((prevState: any) => ({
        ...prevState,
        [index]: item.description,
      }));
      if (item.image) {
        setChildImages((prevState: any) => ({
          ...prevState,
          [index]: item.image
            ? [
                {
                  uid: item.image,
                  name: item.image,
                  status: "done",
                  url: getFileUrl(item.image),
                  isSaved: true,
                },
              ]
            : [],
        }));
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValues]);

  return (
    <Form
      labelCol={{ span: 24 }}
      form={form}
      onFinish={saveCmsDetails}
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
          {props.mode === "add" ? "Add CMS" : "Edit CMS"}
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
          <Form.Item label="Image">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={true}
              fileList={image ? image : []}
              onChange={(info) => {
                if (info.file.status === "removed") setImage(null);
                else setImage(info.fileList);
              }}
              customRequest={(item: any) => item.onSuccess(null, item.file)}
            >
              {!image && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
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
          <Form.Item label="Meta Description (SEO)" name="metaDescription">
            <Input
              showCount
              maxLength={256}
              placeholder="Enter the meta description to be used for SEO"
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider>Child Contents</Divider>

      <Form.List name="children">
        {(fields, { add, remove }) => (
          <>
            {fields.length > 0 && (
              <>
                {fields.map(({ key, name }, index) => (
                  <Card
                    key={key}
                    className="shadow"
                    style={{ marginBottom: "1rem" }}
                  >
                    <Form.Item
                      name={[name, "title"]}
                      label="Title"
                      rules={[
                        { required: true, message: "Title is required!" },
                      ]}
                    >
                      <Input placeholder="Enter the title" />
                    </Form.Item>

                    {props.mode === "edit" && (
                      <Form.Item name={[name, "slug"]} label="Slug">
                        <Input placeholder="Enter the slug" />
                      </Form.Item>
                    )}

                    <Form.Item name={[name, "image"]} label="Image">
                      <Upload
                        name="image"
                        listType="picture-card"
                        showUploadList={true}
                        fileList={childImages[index] ? childImages[index] : []}
                        onChange={(info) => {
                          if (info.file.status === "removed") {
                            setChildImages({
                              ...childImages,
                              [index]: null,
                            });
                          } else {
                            setChildImages({
                              ...childImages,
                              [index]: info.fileList,
                            });
                          }
                        }}
                        customRequest={(item: any) =>
                          item.onSuccess(null, item.file)
                        }
                      >
                        {!childImages[index] && (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>

                    <Form.Item label="Description">
                      <RichEditor
                        modules={modules}
                        formats={formats}
                        value={childDescriptions[index] ?? ""}
                        onChange={(value) =>
                          setChildDescriptions({
                            ...childDescriptions,
                            [index]: value,
                          })
                        }
                      />
                    </Form.Item>

                    <Row>
                      <Button
                        type="primary"
                        danger
                        onClick={() => {
                          remove(index);
                          setChildDescriptions({
                            ...childDescriptions,
                            [index]: undefined,
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </Row>
                  </Card>
                ))}
              </>
            )}

            <Row justify="center" style={{ marginTop: "1rem" }}>
              <Button
                type="primary"
                onClick={() => add()}
                icon={<PlusOutlined />}
              />
            </Row>
          </>
        )}
      </Form.List>
    </Form>
  );
}
