import {
  BarChartOutlined,
  CommentOutlined,
  FileImageOutlined,
  ReadOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";

import Link from "next/link";
import { Menu, Row } from "antd";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "../../context/GlobalContext";
import { useRouter } from "next/router";

export default function SideNav(props: ISideNavProps) {
  const gContext = useContext(GlobalContext);
  const router = useRouter();

  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");

  useEffect(() => {
    setActiveMenuItem(router.pathname);
  }, [router.pathname]);

  return (
    <>
      <Row
        justify="center"
        style={{
          marginBottom: "1rem",
          position: "sticky",
          top: 0,
          padding: 10,
          background: "#120338",
          zIndex: 10,
        }}
      >
        <img
          src={props.collapsed ? "/logo.png" : "/logo.png"}
          width={props.collapsed ? 40 : 200}
          height={props.collapsed ? 40 : 56}
          alt="Intopros"
          title="Intopros"
          style={{ objectFit: "contain" }}
        />
      </Row>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        style={{ paddingBottom: "3rem" }}
        onClick={({ key }) => setActiveMenuItem(key)}
        activeKey={activeMenuItem}
        selectedKeys={[activeMenuItem]}
      >
        <Menu.Item key="/" icon={<BarChartOutlined />}>
          <Link href="/">Dashboard</Link>
        </Menu.Item>

        {gContext.isAdmin && (
          <Menu.Item key="/site-settings" icon={<ToolOutlined />}>
            <Link href="/site-settings">Site Settings</Link>
          </Menu.Item>
        )}

        <Menu.Item key="/contact-us" icon={<CommentOutlined />}>
          <Link href="/contact-us">Contact Messages</Link>
        </Menu.Item>

        <Menu.Item key="/users/system" icon={<UserOutlined />}>
          <Link href="/users/system">System Users</Link>
        </Menu.Item>

        <Menu.Item key="/testimonials" icon={<CommentOutlined />}>
          <Link href="/testimonials">Testimonials</Link>
        </Menu.Item>

        <Menu.SubMenu key="blogs" icon={<ReadOutlined />} title="Blogs">
          <Menu.Item key="/blogs">
            <Link href="/blogs">Blogs</Link>
          </Menu.Item>
          <Menu.Item key="/blogs/categories">
            <Link href="/blogs/categories">Categories</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="careers" icon={<ReadOutlined />} title="Careers">
          <Menu.Item key="/careers">
            <Link href="/careers">Careers</Link>
          </Menu.Item>
          <Menu.Item key="/careers/categories">
            <Link href="/careers/categories">Categories</Link>
          </Menu.Item>
          <Menu.Item key="/careers/applications">
            <Link href="/careers/applications">Applications</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="trainings" icon={<ReadOutlined />} title="Trainings">
          <Menu.Item key="/trainings">
            <Link href="/trainings">Trainings</Link>
          </Menu.Item>
          <Menu.Item key="/trainings/categories">
            <Link href="/trainings/categories">Categories</Link>
          </Menu.Item>
          <Menu.Item key="/trainings/applications">
            <Link href="/trainings/applications">Applications</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="technologies"
          icon={<ReadOutlined />}
          title="Tools and Technologies"
        >
          <Menu.Item key="/technologies">
            <Link href="/technologies">Technologies</Link>
          </Menu.Item>
          <Menu.Item key="/technologies/info">
            <Link href="/technologies/info">Tech Info</Link>
          </Menu.Item>
          <Menu.Item key="/technologies/frameworks">
            <Link href="/technologies/frameworks">Tech Framework</Link>
          </Menu.Item>
          <Menu.Item key="/technologies/FAQ">
            <Link href="/technologies/FAQ">Tech FAQ</Link>
          </Menu.Item>
          <Menu.Item key="/technologies/hiring-menu">
            <Link href="/technologies/hiring-menu">Hiring Menu</Link>
          </Menu.Item>
          <Menu.Item key="/technologies/hiring-applications">
            <Link href="/technologies/hiring-applications">
              Hiring Applications
            </Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="our-team" icon={<ReadOutlined />}>
          <Link href="/our-team">Our Team</Link>
        </Menu.Item>

        <Menu.Item key="our-clients" icon={<ReadOutlined />}>
          <Link href="/our-clients">Our Clients</Link>
        </Menu.Item>

        <Menu.Item key="services" icon={<ReadOutlined />} title="Services">
          <Link href="/services">Services</Link>
        </Menu.Item>

        <Menu.Item key="works" icon={<ReadOutlined />} title="Works">
          <Link href="/works">Works</Link>
        </Menu.Item>

        <Menu.Item key="/gallery" icon={<FileImageOutlined />}>
          <Link href="/gallery">Gallery</Link>
        </Menu.Item>

        <Menu.Item key="/cms" icon={<ReadOutlined />}>
          <Link href="/cms">CMS Pages</Link>
        </Menu.Item>
      </Menu>
    </>
  );
}

interface ISideNavProps {
  collapsed: boolean;
}
