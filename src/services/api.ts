const GITHUB_USERNAME = 'bhopals';
const API_URL = `https://recruiting.verylongdomaintotestwith.ca/api/{${GITHUB_USERNAME}}/character`;

export const getCharacters = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};

export const saveCharacters = async (payload) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    return await response.json();
};
