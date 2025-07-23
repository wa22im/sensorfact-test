import type { Template } from "aws-cdk-lib/assertions";
import { makeTemplate } from "../common/__mocks__/template";

describe("AppSyncStack", () => {
  describe("dev", () => {
    let template: Template;

    beforeAll(async () => {
      template = await makeTemplate("test", "AppSyncStack");
    });

    it("should create AppSync GraphQL API", () => {
      template.hasResource("AWS::AppSync::GraphQLApi", {
        Properties: {
          Name: "BitcoinEnergyApi",
          AuthenticationType: "API_KEY",
        },
      });
    });

    it("should create AppSync Schema", () => {
      template.hasResource("AWS::AppSync::GraphQLSchema", {});
    });

    it("should create Block Energy Lambda function", () => {
      template.hasResource("AWS::Lambda::Function", {
        Properties: {
          FunctionName: {
            "Fn::Sub": "${AWS::StackName}-BlockEnergyResolver",
          },
          Handler: "src/resolvers/blockEnergyResolver.handler",
          Runtime: "nodejs20.x",
          Timeout: 90,
          MemorySize: 512,
          Environment: {
            Variables: {
              BLOCKCHAIN_API_BASE_URL: "https://blockchain.info",
              ENERGY_PER_BYTE_KWH: "4.56",
            },
          },
        },
      });
    });

    it("should create Daily Energy Lambda function", () => {
      template.hasResource("AWS::Lambda::Function", {
        Properties: {
          FunctionName: {
            "Fn::Sub": "${AWS::StackName}-DailyEnergyResolver",
          },
          Handler: "src/resolvers/dailyEnergyResolver.handler",
          Runtime: "nodejs20.x",
          Timeout: 300,
          MemorySize: 1024,
          Environment: {
            Variables: {
              BLOCKCHAIN_API_BASE_URL: "https://blockchain.info",
              ENERGY_PER_BYTE_KWH: "4.56",
            },
          },
        },
      });
    });

    it("should create AppSync Data Sources for Lambda functions", () => {
      // Block Energy Lambda Data Source
      template.hasResource("AWS::AppSync::DataSource", {
        Properties: {
          Name: "blockEnergyLambda",
          Type: "AWS_LAMBDA",
        },
      });

      // Daily Energy Lambda Data Source
      template.hasResource("AWS::AppSync::DataSource", {
        Properties: {
          Name: "dailyEnergyLambda",
          Type: "AWS_LAMBDA",
        },
      });
    });

    it("should create AppSync Resolvers for queries", () => {
      // Block Energy Query Resolver
      template.hasResource("AWS::AppSync::Resolver", {
        Properties: {
          TypeName: "Query",
          FieldName: "blockEnergyConsumption",
          DataSourceName: "blockEnergyLambda",
        },
      });

      // Daily Energy Query Resolver
      template.hasResource("AWS::AppSync::Resolver", {
        Properties: {
          TypeName: "Query",
          FieldName: "dailyEnergyConsumption",
          DataSourceName: "dailyEnergyLambda",
        },
      });
    });
  });
});
