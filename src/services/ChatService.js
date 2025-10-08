import api from "./api";

export const getUserConversations = async (userId) => {
  try {
    const response = await api.get(`/chat/conversations/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error cargando conversaciones", error);
    return [];
  }
};


export const getChatHistory = async (userId,otherUserId) => {
    try{
    const response = await api.get(`/chat/history/${userId}/${otherUserId}`);
    return response.data;
    } catch (error){
        console.error(error);
    }
};