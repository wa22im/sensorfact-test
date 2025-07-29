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
          FunctionName: 
            "BlockEnergyResolver",
        },
      });
    });

    it("should create Daily Energy Lambda function", () => {
      template.hasResource("AWS::Lambda::Function", {
        Properties: {
          FunctionName: "DailyEnergyResolver",
     
        },
      });
    });

  
    it("should create AppSync Resolvers for queries", () => {
      template.hasResource("AWS::AppSync::Resolver", {
        Properties: {
          TypeName: "Query",
          FieldName: "blockEnergyConsumption",
          DataSourceName: "blockEnergyLambda",
        },
      });

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
