import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Space,
  Typography,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import FileUpload from "../../components/Reusable/ImageUpload";
import { getFileUrl, makeRequest } from "../../utils/api";

function SiteSettings() {
  const [form] = useForm();

  const [settings, setSettings] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  const [uploadedHeaderImg, setUploadedHeaderImg] = useState<any>(false);
  const [uploadedFooterImg, setUploadedFooterImg] = useState<any>(false);

  const cancelEdit = () => {
    setIsEditing(false);
    form.setFieldsValue(settings);
  };

  const saveSiteSettings = async () => {
    const formData = form.getFieldsValue();

    const data = new FormData();
    data.append("officeName", formData.officeName);
    data.append("address", formData.address);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("officeName2", formData.officeName2);
    data.append("address2", formData.address2);
    data.append("email2", formData.email2);
    data.append("phone2", formData.phone2);
    data.append("facebook", formData.facebook);
    data.append("twitter", formData.twitter);
    data.append("linkedIn", formData.linkedIn);
    if (uploadedHeaderImg) {
      data.append("headerLogo", uploadedHeaderImg);
    }
    if (uploadedFooterImg) {
      data.append("footerLogo", uploadedFooterImg);
    }
    const res = await makeRequest("/site-settings", {
      method: "PATCH",
      data: data,
    });
    if (res) {
      notification.success({ message: "Successfully updated site settings" });
      setSettings(res?.data?.data);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    makeRequest("/site-settings").then((res) => {
      if (res) {
        setSettings(res.data?.data);
      }
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return (
    <Form
      form={form}
      labelCol={{ span: 24 }}
      onFinish={saveSiteSettings}
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
        <Typography.Title level={3}>Site Settings</Typography.Title>

        <div>
          {isEditing ? (
            <Space>
              <Button type="default" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          ) : (
            <Button type="primary" danger onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </Row>

      <Row gutter={12}>
        <Typography.Title level={5}>For Office 1</Typography.Title>
        <Col span={24}>
          <Form.Item name="officeName" label="Office Name">
            <Input
              placeholder="Enter the office name"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="address" label="Address">
            <Input
              placeholder="Enter the address"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="email" label="Email">
            <Input
              placeholder="Enter the email"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="phone" label="Phone">
            <Input
              placeholder="Enter the phone"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>

        <Typography.Title level={5}>For Office 2</Typography.Title>
        <Col span={24}>
          <Form.Item name="officeName2" label="Office Name">
            <Input
              placeholder="Enter the office name"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="address2" label="Address">
            <Input
              placeholder="Enter the address"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="email2" label="Email">
            <Input
              placeholder="Enter the email"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="phone2" label="Phone">
            <Input
              placeholder="Enter the phone"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>

        <Divider />

        <Col span={24}>
          <Form.Item name="facebook" label="Facebook">
            <Input
              placeholder="Enter the facebook URL"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="twitter" label="Instagram">
            <Input
              placeholder="Enter the instagram URL"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="linkedIn" label="LinkedIn">
            <Input
              placeholder="Enter the LinkedIn URL"
              readOnly={!isEditing}
              style={{ cursor: isEditing ? "text" : "default" }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="headerLogo" label="Header Logo">
            {!isEditing ? (
              <img
                src={settings.headerLogo && getFileUrl(settings.headerLogo)}
                alt=""
              />
            ) : (
              <FileUpload
                acceptedFileType="image/jpeg, image/png"
                handleChange={(data: any) => setUploadedHeaderImg(data)}
                image={settings.headerLogo && getFileUrl(settings.headerLogo)}
              />
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="footerLogo" label="Footer Logo">
            {!isEditing ? (
              <img
                src={settings.footerLogo && getFileUrl(settings.footerLogo)}
                alt=""
              />
            ) : (
              <FileUpload
                acceptedFileType="image/jpeg, image/png"
                handleChange={(data: any) => setUploadedFooterImg(data)}
                image={settings.footerLogo && getFileUrl(settings.footerLogo)}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default SiteSettings;
