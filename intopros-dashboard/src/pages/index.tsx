import { Image, Typography } from "antd";


function HomePage() {

  return (
    <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
      <div style={{ textAlign: "center" }}>
        <Typography.Title>Intopros</Typography.Title>
      </div>

      <Image
        width="100%"
        preview={false}
        src="https://mobilemonkey.com/wp-content/uploads/2020/12/welcome-greeting-message-1024x536.png"
        alt=""
      />
    </div>
  );
}

export default HomePage;
