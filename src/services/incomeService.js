import {API_URL} from "../util";

export const fetchIncomeData = async (auth, month, year) => {
    const response = await fetch(`${API_URL}/incomes?month=${month}&year=${year}`, {
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
