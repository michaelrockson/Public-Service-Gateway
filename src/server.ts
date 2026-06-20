import express, { type Express } from "express";

const app: Express = express();
const port: number = 3000;

app.listen(port, (): void => {
  console.log(`Server has started port ${port}`);
});
