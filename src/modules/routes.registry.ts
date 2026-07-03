import { Router } from "express";
import { weatherRouter } from "./weather/weather.routes";
import { newsRouter } from "./news/news.routes";

export const apiRouter = Router();

apiRouter.use("/weather", weatherRouter);
apiRouter.use("/news", newsRouter);
