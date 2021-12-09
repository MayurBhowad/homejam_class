const express = require('express');

const app = express();
const PORT = process.env.PORT || 4001;

app.get('/', (req, res) => {
    res.json({ success: true, route: '/' })
});

app.listen(PORT, () => console.log(`Api is up and Rolling...`));