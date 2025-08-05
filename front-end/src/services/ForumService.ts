import axios from "axios";
var FORUM_BASE_URL = 'http://localhost:8080/api/forums/';

export const listAll = async () => {
    const response = await axios.get(FORUM_BASE_URL);
    return response.data;
}

export const getById = async (id : any) => {
    const response = await axios.get(FORUM_BASE_URL + id);
    return response.data;
}


export const createForum = async (forumData: {
    title: string,
    description: string,
    movieId: number,
    username: string
}) => {
    const response = await axios.post(FORUM_BASE_URL, forumData);
    return response.data;
}

