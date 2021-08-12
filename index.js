const express = require('express')
const app = express();
const port = 8000;

app.get('/', (req, res) => {
    res.send('Dynamic content for Chintu 2.0!')
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});
