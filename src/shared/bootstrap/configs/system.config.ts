import { ISystemConfig } from "../../interfaces/config/index.interface.js";

export class SystemConfig implements ISystemConfig {
  public readonly environment: string;
  public readonly port: number;
  public readonly logLevel: string;

  constructor(config: ISystemConfig) {
    this.environment = config.environment;
    this.port = config.port;
    this.logLevel = config.logLevel;
  }
}
