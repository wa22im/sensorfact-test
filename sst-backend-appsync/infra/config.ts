import { z } from "zod";
const SERVICE_NAME = "assignment-btcenergy";
const AWS_REGION = "eu-west-1";
const SUPPORTED_ENVIRONMENTS = ["test"] as const;

export const EnvName = z.enum(SUPPORTED_ENVIRONMENTS).default("test");
export type EnvName = z.infer<typeof EnvName>;

interface EnvConfig {
  rootDomainName: string;
  blockChainUrl: string;
  energyPerByteKwh:string
}

export interface InfraConfig extends EnvConfig {
  serviceName: string;
  awsRegion: string;
  envName: EnvName;
}

const environments: Record<EnvName, EnvConfig> = {
  test: {
    blockChainUrl: "https://blockchain.info",
    energyPerByteKwh: "4.56",
    rootDomainName: "test.wa22im.com",
  },
};

export function getInfraConfig(env: unknown = undefined): InfraConfig {
  const envName = EnvName.parse(env);
  const envConfig = environments[envName];

  const serviceName = SERVICE_NAME;

  return {
    serviceName,
    envName,
    awsRegion: AWS_REGION,
    ...envConfig,
  };
}
