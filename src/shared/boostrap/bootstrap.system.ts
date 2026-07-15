import { ISystemConfig } from "../interfaces/config/config.interface.js";

export class BootstrapSystem implements ISystemConfig {
  public readonly environment: string;
  public readonly port: number;
  public readonly logLevel: string;

  constructor(config: ISystemConfig) {
    this.environment = config.environment;
    this.port = config.port;
    this.logLevel = config.logLevel;
  }
}
