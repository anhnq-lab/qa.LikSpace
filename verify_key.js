const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function check() {
    try {
        console.log("Fetching models from:", URL.replace(API_KEY, "KEY"));
        const res = await axios.get(URL);
        console.log("Status:", res.status);
        console.log("Models:", res.data.models.map(m => m.name));
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}

check();
