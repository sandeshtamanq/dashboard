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
  
  
  import { makeRequest } from "../../utils/api";
  
  interface IProps {
    mode: "add" | "edit";
    defaultValues?: any;
  }
  export default function TrainingCategoryForm(props: IProps) {
    const router = useRouter();
    const [form] = useForm();
  
    const resetValues = () => {
      if (props.mode === "add") {
        form.resetFields();
      } else {
        form.setFieldsValue(props.defaultValues);
      }
    };
  
    const saveTrainingCategoryDetails = (values: any) => {
 
      // return console.log(values, uploadedImg, isImageDeleted);
  
      makeRequest(props.mode === "add" ? "/trainings/category" : `/trainings/category/${router.query.id}`, {
        method: props.mode === "add" ? "POST" : "PATCH",
        data: values,
      }).then((res) => {
        if (res) {
          const notificationMsg =
            props.mode === "add"
              ? "Successfully created Training Category"
              : "Succefully updated Training Category";
  
          notification.success({ message: notificationMsg });
          router.push("/trainings/categories");
        }
      });
    };
  
    useEffect(() => {
      if (props.mode === "add") return;
  
      form.setFieldsValue(props.defaultValues);
      },[props.defaultValues]);
  
    return (
      <Form
        labelCol={{ span: 24 }}
        form={form}
        onFinish={saveTrainingCategoryDetails}
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
            {props.mode === "add" ? "Add Training" : "Edit Training"}
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
  