import api from "../../utils/API";
import { useMutation, useQuery } from "@tanstack/react-query";


const searchGroup = async (searchText) => {
    if (!searchText || searchText.length < 2) return [];
    const { data } = await api.get(`/groups/search?q=${searchText}`);
    console.log(data, "data");
    return data;
};

const joinGroup = async ({ groupId, password }) => {
    if (!groupId || !password) throw new Error("Group ID and password are required");
    const { data } = await api.post(`/groups/${groupId}/join`, { password });
    return data;
};

const useGroups = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            try {
                const response = await api.get("/groups");
                console.log("Groups API Response:", response.data);
                return response.data || [];
            } catch (error) {
                console.error("Ошибка загрузки групп:", error);
                return [];
            }
        },
        select: (data) => data || [],
    });
};

const useJoinGroup = () => {
    return useMutation(joinGroup);
};

export { useGroups, useJoinGroup };
