import { NewsService } from "./news.service.js";
import { NewsController } from "./news.controller.js";
import { ModuleResourcesProvider } from "../../shared/utils/config/config.types.js";

export function provideNewsResources(): ModuleResourcesProvider {
  const newsService = new NewsService();
  const newsController = new NewsController(newsService);

  return {
    name: "News",
    service: newsService,
    controller: newsController
  };
}