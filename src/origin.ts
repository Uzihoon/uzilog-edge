import { Context } from "aws-lambda";
import { S3 } from "aws-sdk";
import { parsingHTML } from "../libs/parsing-html";
import * as dynamoDbLib from "../libs/dynamodb-lib";

const UrlPattern = require("url-pattern");
const s3 = new S3();

interface Result {
  Item: {
    content: string;
    createdAt: number;
    postId: string;
    tag: string;
    desc: string;
    title: string;
  };
}

export async function request(event: any, context: Context, callback: any) {
  const request = event.Records[0].cf.request;
  const pattern = new UrlPattern("/post(/*)");
  const { headers, origin, uri } = request;
  const match = pattern.match(uri);

  if (match && match._) {
    let is_crawler: string;

    if ("is-crawler" in headers) {
      is_crawler = headers["is-crawler"][0].value.toLowerCase();
    }
    console.log(is_crawler);

    if (is_crawler === "true") {
      const postId = match._;
      const params = {
        TableName: process.env.tableName,
        Key: {
          postId
        }
      };
      const html = await s3
        .getObject({ Bucket: process.env.s3Bucket, Key: process.env.s3File })
        .promise()
        .then(data => data.Body.toString())
        .catch(err => console.log(err));
      console.log(html);
      const result: Result = await dynamoDbLib.call("get", params);

      const title = result.Item.title;
      const desc = result.Item.desc;
      const parsed = parsingHTML(html, title, desc, postId);

      headers.host = [{ key: "Host", value: process.env.domainName }];
      origin.s3.domainName = process.env.domainName;
    }
  }
  console.log(JSON.stringify(request));
  callback(null, request);
}
