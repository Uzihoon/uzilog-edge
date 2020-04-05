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
  // const request = event.Records[0].cf.request;
  // const pattern = new UrlPattern("/post(/*)");
  // const { headers, origin, uri } = request;
  // const match = pattern.match(uri);

  // if (match._) {
  //   let is_crawler: string;

  //   if ("is-crawler" in headers) {
  //     is_crawler = headers["is-crawler"][0].value.toLowerCase();
  //   }

  //   if (is_crawler === "true") {
  //     const postId = match._;
  //     const params = {
  //       TableName: process.env.TABLE_NAME,
  //       Key: {
  //         postId
  //       }
  //     };
  //     const html = await s3
  //       .getObject({ Bucket: process.env.S3_BUCKET, Key: process.env.S3_FILE })
  //       .promise()
  //       .then(data => data.Body.toString())
  //       .catch(err => console.log(err));

  //     const result: Result = await dynamoDbLib.call("get", params);

  //     const title = result.Item.title;
  //     const desc = result.Item.desc;
  //     const parsed = parsingHTML(html, title, desc, postId);

  //     headers.host = [{ key: "Host", value: process.env.DOMAIN_NAME }];
  //     origin.s3.domainName = process.env.DOMAIN_NAME;
  //   }
  // }
  console.log(JSON.stringify(request));
  callback(null, request);
}
