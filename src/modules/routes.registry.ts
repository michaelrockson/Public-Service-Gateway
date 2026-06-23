import { Router } from "express";
import { weatherRouter } from "./weather/weather.routes";

export const apiRouter = Router();
apiRouter.use("/weather", weatherRouter);
