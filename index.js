const express = require('express')
const app = express();
const port = 4000;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

app.use(() => {
    console.log('tes satu');
    console.log('tes dua');
    console.log('tes tiga');
    console.log('tes banyak....');
})