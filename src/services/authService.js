import {API_URL} from "../util";

export const loginUser = async (email, password) => {
    const response = await fetch(API_URL+'/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify({
            email: email.toLowerCase(),
            password: password,
        })
    });
    return await response.json();
};