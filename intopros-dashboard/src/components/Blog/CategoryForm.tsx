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
  import { useEffect } from "react";
  import { useRouter } from "next/router";
  
  // Rich text editor
  
  import { makeRequest } from "../../utils/api";
  
  interface IProps {
    mode: "add" | "edit";
    defaultValues?: any;
  }
  export default function CategoryForm(props: IProps) {
    const router = useRouter();
    const [form] = useForm();
    
    const resetValues = () => {
      if (props.mode === "add") {
        form.resetFields();
      } else {
        form.setFieldsValue(props.defaultValues);
      }
    };
  
    const saveBlogCategoryDetails = (values: any) => {

      makeRequest(props.mode === "add" ? "/blogs/category" : `/blogs/category/${router.query.id}`, {
        method: props.mode === "add" ? "POST" : "PATCH",
        data: values,
      }).then((res) => {
        if (res) {
          const notificationMsg =
            props.mode === "add"
              ? "Successfully created Blog"
              : "Succefully updated Blog";
  
          notification.success({ message: notificationMsg });
          router.push("/blogs/categories");
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
        onFinish={saveBlogCategoryDetails}
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
              name="category"
              label="Category"
              rules={[
                {
                  required: true,
                  message: "Category is required!",
                },
              ]}
            >
              <Input placeholder="Enter the category" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
  