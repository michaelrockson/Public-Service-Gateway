import { NewsService } from "./news.service.js";
import { NewsController } from "./news.controller.js";
import {
  ModuleResourcesProvider,
  SharedDependencies,
} from "../../shared/boostrap/gateway.types.js";
import { AxiosHttpClient } from "../../shared/http/axios.client.js";

export function provideNewsResources(
  deps: SharedDependencies,
): Extract<ModuleResourcesProvider, { name: "news" }> {
  const newsHttpClient = new AxiosHttpClient(
    deps.config.newsApiUrl,
    deps.config.newsApiKey,
    "apiKey",
  );
  const newsService = new NewsService(newsHttpClient);
  const newsController = new NewsController(newsService, deps.responseHandler);

  return {
    name: "news",
    service: newsService,
    controller: newsController,
  };
}
