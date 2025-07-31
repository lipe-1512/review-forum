import axios from "axios";
var FORUM_BASE_URL = 'http://localhost:8080/api/forums/';


export const listAll = async () => {
    const response = await axios.get(FORUM_BASE_URL);
    return response.data;
}


