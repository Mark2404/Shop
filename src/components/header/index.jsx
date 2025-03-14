import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { Layout, Menu, Input, Button, Modal } from "antd";
import { useSearchGroups } from "../hooks/groupsData";
import { logout } from "../../utils/API";
import { RxExit } from "react-icons/rx";
import "./index.scss";

const { Header, Sider, Content } = Layout;

const Home = () => {
    const [searchText, setSearchTerm] = useState("");
    const [groupResults, setGroupResults] = useState([]);
    const { data: searchResults = [], isLoading } = useSearchGroups(searchTerm);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (searchResults) {
            setGroupResults(searchResults);
        }
    }, [searchResults]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <Layout>
            <Sider collapsible>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["1"]}
                    mode="inline"
                    items={[
                        { key: "1", icon: <RxExit />, label: "Profile" },
                        { key: "2", icon: <DesktopOutlined />, label: "Option 2" },
                    ]}
                    onClick={(e) => setSelectedKey(e.key)}
                />
                <Button type="primary" icon={<RxExit />} onClick={logout}>
                    Log out
                </Button>
            </Sider>
            <Layout>
                <Header>
                    <div className="header">
                        <Input
                            placeholder="Search groups..."
                            className="input"
                            prefix={<FaSearch />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                        />
                    </div>
                </Header>
                <Content>
                    <div style={{ padding: "20px" }}>
                        {isLoading ? (
                            <p>Loading groups...</p>
                        ) : groupResults.length > 0 ? (
                            <ul className="groups-list">
                                {groupResults.map((group) => (
                                    <li key={group.id}>
                                        <h4>{group.name}</h4>
                                        <Button type="primary" onClick={() => openJoinModal(group)}>
                                            Join
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            searchTerm.trim() ? <p className="no-results">No groups found</p> : null
                        )}
                </Content>
            </Layout>
            <Modal
                title={`Join ${selectedGroup?.name}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Input.Password
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="primary" style={{ marginTop: 10 }} onClick={handleJoinGroup}>
                    Join Group
                </Button>
            </Modal>
        </Content>
        </Layout >
    );
};

export default Home;
