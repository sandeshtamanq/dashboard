import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

interface IFileUploadProps {
  image?: string;
  handleChange?: any;
  acceptedFileType?: string;
}
function FileUpload(props: IFileUploadProps) {
  const [state, setState] = useState<any>({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });

  const acceptedFileTypes = props.acceptedFileType ?? "image/*";

  const handleCancel = () => setState({ ...state, previewVisible: false });

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState({
      ...state,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const handleChange = ({ file, fileList }: any) => {
    setState({ ...state, fileList });

    if (props.handleChange) {
      if (file.status === "done") {
        props.handleChange(file.originFileObj);
      } else if (file.status === "removed") {
        props.handleChange("{{DELETE}}");
      }
    }
  };

  useEffect(() => {
    if (props.image) {
      setState({
        ...state,
        fileList: [
          {
            uid: "1",
            name: props.image.substring(props.image.lastIndexOf("/") + 1),
            status: "done",
            url: props.image,
          },
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.image]);

  const { previewVisible, previewImage, fileList, previewTitle } = state;
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        customRequest={(item: any) => item.onSuccess(null, item.file)}
        onPreview={handlePreview}
        onChange={handleChange}
        accept={acceptedFileTypes}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt={previewTitle} style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
}

export default FileUpload;
