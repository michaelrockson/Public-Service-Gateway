import { NewsService } from "./news.service.js";
import { NewsController } from "./news.controller.js";
import { ModuleResourcesProvider } from "../../shared/utils/config/config.types.js";

export function provideNewsResources(): Extract<ModuleResourcesProvider, { name: "news" }> {
  const newsService = new NewsService();
  const newsController = new NewsController(newsService);

  return {
    name: "news",
    service: newsService,
    controller: newsController
  };
}