import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";

import { makeRequest } from "../../utils/api";

interface IUserFormProps {
  mode: "add" | "edit";
  type: "system";
  defaultValues?: any;
  rawData?: any;
}

export default function UserForm(props: IUserFormProps) {
  const router = useRouter();
  const [form] = useForm();

  const [isProfileIncomplete, setIsProfileIncomplete] = useState(true);

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);


  const resetForm = () => {
    if (props.mode === "add") {
      form.resetFields();

    } else {
      form.setFieldsValue(props.defaultValues);

    }
  };

  const saveUserDetails = async (values: any) => {
    const { picture, ...valuesToPost } = values;

    const dataToPost = {
      ...valuesToPost,
    };

    makeRequest(
      props.mode === "add"
        ? "/users/list"
        : `/users/list/${props.defaultValues?.id}`,
      {
        method: props.mode === "add" ? "POST" : "PATCH",
        data: dataToPost,
      }
    ).then((res) => {
      if (res) {
        notification.success({ message: res.data?.message });
        router.push(`/users/${props.type}`);
      }
    });
  };

  const updateVerificationDetails = async (values: any) => {
    const res = await makeRequest(`/users/list/${props.defaultValues?.id}`, {
      method: "PATCH",
      data: values,
    });
    if (res) {
      notification.success({
        message: "Successfully updated user's verification status!",
      });
      setIsVerificationModalOpen(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(props.defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValues]);

  return (
    <>
      <Form
        labelCol={{ span: 24 }}
        form={form}
        onFinish={saveUserDetails}
        onFinishFailed={() => {
          notification.error({
            message:
              "Please fill all the required fields and make sure they are valid!",
          });
        }}
        scrollToFirstError
        style={{ paddingBottom: "2rem" }}
      >
        <Row justify="space-between" align="middle" className="action-bar">
          <Typography.Title level={3}>
            {props.mode === "add" ? "Add User" : "Edit User"}
          </Typography.Title>

          <div>
            <Space>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button type="primary" danger onClick={resetForm}>
                Reset
              </Button>
            </Space>
          </div>
        </Row>

        {/* Basic Info starts here */}
        <div>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "First Name is required" }]}
              >
                <Input placeholder="Enter the first name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="middleName" label="Middle Name">
                <Input placeholder="Enter the middle name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Last Name is required" }]}
              >
                <Input placeholder="Enter the last name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <Input
                  placeholder="Enter the email"
                  readOnly={props.mode === "edit"}
                  style={{
                    cursor: props.mode === "edit" ? "not-allowed" : "auto",
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Username is required" }]}
              >
                <Input
                  placeholder="Enter the username"
                  readOnly={props.mode === "edit"}
                  style={{
                    cursor: props.mode === "edit" ? "not-allowed" : "auto",
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="mobile"
                label="Mobile Number"
                rules={[
                  { required: true, message: "Mobile number is required" },
                ]}
              >
                <Input placeholder="Enter the mobile number" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="telephone" label="Telephone">
                <Input placeholder="Enter the telephone number" />
              </Form.Item>
            </Col>

            {props.type === "system" && (
              <Col span={8}>
                <Form.Item
                  name="role"
                  label="Role"
                  initialValue="support"
                  rules={[
                    {
                      required: props.type === "system",
                      message: "Role is required",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={[
                      { label: "Admin", value: "admin" },
                      { label: "Support", value: "support" },
                    ]}
                    placeholder="Select the role"
                  />
                </Form.Item>
              </Col>
            )}

            <Col span={8}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Password is required" },
                ]}>
                <Input placeholder="Enter a password"
                  readOnly={props.mode === "edit"}
                  style={{
                    cursor: props.mode === "edit" ? "not-allowed" : "auto",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
        {/* Basic Info ends here */}
      </Form>

      <Modal
        footer={null}
        visible={isVerificationModalOpen}
        title="User's verification Status"
        onCancel={() => setIsVerificationModalOpen(false)}
      >
        <UserVerificationForm
          initialValues={props.defaultValues ?? {}}
          isIncomplete={isProfileIncomplete}
          updateVerificationDetails={updateVerificationDetails}
        />
      </Modal>
    </>
  );
}

const UserVerificationForm = (props: IUserVerificationFormProps) => {
  const [form] = useForm();

  const [noRemark, setNoRemark] = useState(true);

  useEffect(() => {
    const { isProfileVerified, verificationRemark } = props.initialValues;

    setNoRemark(isProfileVerified);
    form.setFieldsValue({ isProfileVerified, verificationRemark });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialValues]);

  return (
    <Form
      form={form}
      labelCol={{ span: 24 }}
      colon={false}
      name="verification"
      onFinish={props.updateVerificationDetails}
    >
      <div style={{ marginBottom: "1rem" }}>
        <Typography.Text type="danger">
          <strong>NOTE: </strong>
          <span>Profile details is not yet completely filled by the user!</span>
        </Typography.Text>
      </div>

      <Form.Item
        name="isProfileVerified"
        label="Verification Status"
        rules={[{ required: true, message: "Verification status is required" }]}
      >
        <Radio.Group onChange={(e) => setNoRemark(e.target.value)}>
          <Radio value={true}>Verified</Radio>
          <Radio value={false}>Not Verified</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="verificationRemark"
        label="Verification Remarks"
        rules={[
          {
            required: !noRemark,
            message: "Please mention why the profile marked as not verified!",
          },
        ]}
      >
        <Input.TextArea rows={5} />
      </Form.Item>

      <Divider />
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

interface IUserVerificationFormProps {
  initialValues: any;
  isIncomplete: boolean;
  updateVerificationDetails: (values: any) => void;
}
