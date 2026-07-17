import { ISystemSecretsRegistry } from "../../app/interfaces/config/index.interface.js";

export class SystemEnvs implements ISystemSecretsRegistry {
  public readonly environment: string;
  public readonly port: number;
  public readonly logLevel: string;

  constructor(systemEnvs: ISystemSecretsRegistry) {
    this.environment = systemEnvs.environment;
    this.port = systemEnvs.port;
    this.logLevel = systemEnvs.logLevel;
  }
}
