import express from 'express';

const app = express();
const port = process.env.port || 3030;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`App listening on port ${port}!`));
