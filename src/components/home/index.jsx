import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserOutlined, PlusOutlined, DesktopOutlined } from "@ant-design/icons";
import { Layout, Menu, theme, Button, Input, Modal } from "antd";
import { FaShopify } from "react-icons/fa";
import Header from "../header";
import Profile from "../profile";
import { useCreateGroup } from "../hooks/groupsData";

const { Content, Sider } = Layout;
import { Breadcrumb } from "antd";

const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState("1");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const createGroupMutation = useCreateGroup();
    const [groupPassword, setGroupPassword] = useState("");

    const navigate = useNavigate();



    const handleAddGroup = async () => {
        try {
            await createGroupMutation.mutateAsync({ name: groupName, password: groupPassword });
            setGroupName("");
            setGroupPassword("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Ошибка при создании группы:", error);
        }
    };
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items = [
        getItem("Profile", "1", <UserOutlined />),
        getItem("Option 2", "2", <DesktopOutlined />)
    ];

    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }

    const renderContent = () => {
        if (selectedKey === "1") return <Profile />;
        if (selectedKey === "2") return <p>Option 2 Content</p>;
        return <p>Select a menu item</p>;
    };



    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        width: "100%",
                        height: "40px",
                        backgroundColor: "#1677FF",
                        marginBottom: "20px",
                    }}
                >
                    <FaShopify style={{ color: "white", width: "30px", height: "30px" }} />
                </div>
                <Menu
                    theme="dark"
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setSelectedKey(e.key)}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ margin: "16px" }}>
                    Add Group
                </Button>
            </Sider>
            <Layout>
                <Header />
                <Content style={{ margin: "0 16px" }}>
                    <Breadcrumb
                        style={{ margin: "16px 0" }}
                        items={[
                            { title: "User" },
                            { title: selectedKey === "1" ? "Profile" : "Option 2" },
                        ]}
                    />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
            <Modal title="Add Group" open={isModalOpen} onOk={handleAddGroup} onCancel={() => setIsModalOpen(false)}>
                <Input
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <Input.Password
                    placeholder="Enter password"
                    value={groupPassword}
                    onChange={(e) => setGroupPassword(e.target.value)}
                    style={{ marginTop: 10 }}
                />
            </Modal>
        </Layout>
    );
};

export default Home;
