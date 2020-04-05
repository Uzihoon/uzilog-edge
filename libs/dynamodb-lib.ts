import { DynamoDB } from "aws-sdk";

type Actions = "get" | "put" | "delete" | "query" | "update" | "scan";

export function call(actions: Actions, params: any) {
  const dynamoDb = new DynamoDB.DocumentClient();

  return dynamoDb[actions](params).promise() as any;
}
