import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json('Hello World social people!');
});

app.listen(5300, () =>
  console.log(`Social app listening on port 5300!`),
);