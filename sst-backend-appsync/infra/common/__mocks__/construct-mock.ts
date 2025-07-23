import type { Construct } from "constructs";

export const makeConstructMock = (id: string) =>
  Object.assign({} as Construct, {
    node: {
      id,
    },
  });
