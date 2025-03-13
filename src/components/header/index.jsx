import React, { useState } from "react";
import { RxExit } from "react-icons/rx";
import { Modal, Input, Button, message } from "antd";
import { logout } from "../../utils/API";
import { useGroups, useJoinGroup } from "../hooks/groupsData";

import "./index.scss";

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [password, setPassword] = useState("");

    const { data: groups = [], isLoading, isError } = useGroups(searchTerm);

    const joinGroupMutation = useJoinGroup();

    const openJoinModal = (group) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    const handleJoinGroup = async () => {
        if (!selectedGroup) return;
        try {
            await joinGroupMutation.mutateAsync({ groupId: selectedGroup.id, password });
            message.success(`Successfully joined ${selectedGroup.name}!`);
            setIsModalOpen(false);
            setPassword("");
        } catch (error) {
            message.error("Failed to join group. Check the password.");
        }
    };
    console.log(groups);
    return (
        <div className="header">
            <header>
                <h1>Useful Product List</h1>
                <div>
                    <Input
                        placeholder="Search groups..."
                        className="input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        enterButton="Search"
                    />

                    {isLoading ? (
                        <p>Loading...</p>
                    ) : isError ? (
                        <p className="error">Error loading groups</p>
                    ) : Array.isArray(groups) && groups.length > 0 ? (
                        <ul className="groups-list">
                            {groups.map((group) => (
                                <li key={group.id}>
                                    <div className="group">
                                        <h4>{group.name}</h4>
                                        <Button type="primary" onClick={() => openJoinModal(group)}>
                                            Join
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (searchTerm.trim() ? (
                        <p className="no-results">No groups found</p>
                    ) : null)}
                </div>


                <div className="exit-box" onClick={logout}>
                    <p>Log out</p>
                    <RxExit className="exit-icon" />
                </div>
            </header>

            <Modal
                title={`Join ${selectedGroup?.name}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                className="custom-modal"
            >
                <p>Enter group password:</p>
                <Input.Password
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="primary" style={{ marginTop: 10 }} onClick={handleJoinGroup}>
                    Join Group
                </Button>
            </Modal>
        </div>
    );
};

export default Header;