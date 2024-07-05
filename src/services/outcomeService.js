import {API_URL} from "../util";

export const fetchOutcomeData = async (auth, month, year) => {
    const response = await fetch(`${API_URL}/outcomes?month=${month}&year=${year}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Authorization': auth,
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
};
