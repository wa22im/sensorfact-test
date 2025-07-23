# Bitcoin Energy Consumption API - Two Serverless Approaches

## Overview

This repository demonstrates **two different serverless GraphQL architectures** for implementing a Bitcoin energy consumption API, showcasing the flexibility of modern serverless development patterns.

## Architectural Approaches

### 1. Lambda Monolith (Original Assignment)
**Location**: `backend-assignment-btcenergy-main/`

This implementation follows the **Lambda Monolith** pattern, where a single AWS Lambda function handles all GraphQL operations.

- **Single Lambda Function**: One function processes all GraphQL queries
- **Internal Routing**: GraphQL resolvers route requests within the Lambda
- **Serverless Framework**: Traditional serverless deployment approach

- **Simplified Deployment**: Single function to deploy and manage

### 2. AppSync with Micro-Lambdas (SST Implementation)
**Location**: `srseu-pay-sst-template-main/`

This implementation follows the **GraphQL with Multiple Resolvers** pattern using AWS AppSync and individual Lambda functions per resolver.

- **AWS AppSync**: Managed GraphQL service handles query parsing and execution
- **Individual Lambda Resolvers**: Separate functions for each GraphQL operation
- **SST Framework**: Modern Infrastructure as Code with AWS CDK
- **Native GraphQL SDL**: Standard GraphQL schema definition language

- **Independent Scaling**: Each resolver scales based on its own usage
- **Parallel Execution**: Multiple resolvers can run simultaneously

## AWS Documentation Reference

This implementation follows AWS best practices as outlined in their official documentation:
**[Building Serverless GraphQL APIs](https://aws.amazon.com/graphql/serverless-api/)**

The AWS documentation explains both approaches:
- **Lambda + GraphQL**: Single endpoint handling all operations
- **AppSync + Lambda Resolvers**: Distributed resolvers with managed GraphQL

## Code Modularity Advantage

Because we implemented **clean architecture** with proper separation of concerns, migrating between these approaches was straightforward:

### Shared Components
```
domain/          # Business logic (identical in both projects)
├── calculateEnergyConsumption.ts
└── energyModels.ts

services/        # Application services (identical in both projects)
├── calculateConsumption.ts
└── calculateDailyConsumption.ts

data/           # External integrations (identical in both projects)
└── blockchainService.ts

utils/          # Helper functions (identical in both projects)
└── dateUtils.ts
```

