import { schemaComposer } from '../schema/blockEnergyTypes';
import { blockEnergyConsumptionResolver } from '../resolvers/blockEnergyResolver';
import { dailyEnergyConsumptionResolver } from '../resolvers/dailyEnergyResolver';

schemaComposer.Query.addFields({
  hello: {
    type: 'String!',
    resolve: () => 'Hi there, good luck with the assignment!',
  },
  blockEnergyConsumption: blockEnergyConsumptionResolver,
  dailyEnergyConsumption: dailyEnergyConsumptionResolver,
});

export { schemaComposer };
