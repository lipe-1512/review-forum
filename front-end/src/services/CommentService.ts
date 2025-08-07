import axios from 'axios';

const API_URL = 'http://localhost:8080/api/comments';

export const listAll = async (forumId: any) => {
    const response = await axios.get(`${API_URL}/get-by-forum/${forumId}`);
    return response.data;
};


export const create = async (comment: any) => {
    return axios.post(`${API_URL}`, comment);
};

export const update = async (id: number, commentData: {
    content: string
}) => {
    const response = await axios.put(`${API_URL}/${id}`, commentData);
    return response.data;
};