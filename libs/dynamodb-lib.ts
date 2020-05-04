import { DynamoDB } from "aws-sdk";

type Actions = "get" | "put" | "delete" | "query" | "update" | "scan";

export function call(actions: Actions, params: any) {
  const dynamoDb = new DynamoDB.DocumentClient({
    region: "ap-northeast-2"
  });

  return dynamoDb[actions](params).promise() as any;
}
