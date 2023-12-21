import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json('Hello World transactions!');
});

app.listen(5400, () =>
  console.log(`Transaction app listening on port 5400!`),
);