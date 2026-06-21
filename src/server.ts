import express, { type Express } from "express";
import { weatherRouter } from "./modules/weather/weather.routes";

const app: Express = express();
const port: number = 3000;

app.use(express.json());
app.use("/api/weather", weatherRouter);

app.listen(port, (): void => {
  console.log(`Server has started port ${port}`);
});
