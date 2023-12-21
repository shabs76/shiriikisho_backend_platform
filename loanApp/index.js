import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json('Hello World loans!');
});

app.listen(5500, () =>
  console.log(`Loan app listening on port 5500!`),
);