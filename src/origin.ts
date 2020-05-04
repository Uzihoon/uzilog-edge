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

export async function response(event: any, context: Context, callback: any) {
  try {
    console.log("-----event-----");
    console.log(JSON.stringify(event.Records[0].cf));
    const { request, response } = event.Records[0].cf;
    const pattern = new UrlPattern("/post(/*)");
    const { headers, origin, uri } = request || {};
    const match = pattern.match(uri);

    if (match && match._) {
      // post로 조회하는 경우
      let is_crawler: string;

      if ("is-crawler" in headers) {
        is_crawler = headers["is-crawler"][0].value.toLowerCase();
      }
      console.log(is_crawler);

      if (is_crawler === "true") {
        const postId = match._;
        const params = {
          TableName: "uzilog",
          Key: { postId }
        };
        console.log("-----params-----");

        console.log(params);
        const html = await s3
          .getObject({ Bucket: "uzilog-project", Key: "index.html" })
          .promise()
          .then(data => data.Body.toString())
          .catch(err => console.log(err));
        console.log("-----html-----");
        console.log(JSON.stringify(html));
        const result: Result = await dynamoDbLib.call("get", params);
        console.log("-----result-----");

        console.log(JSON.stringify(result));
        const title = result.Item.title;
        const content = result.Item.content;
        response.status = 200;
        response.body = parsingHTML(html, title, content, postId);
        response.headers["content-type"] = [
          {
            key: "Content-Type",
            value: "text/html"
          }
        ];
        console.log("-----response-----");

        console.log(JSON.stringify(response));
      }
    }
    console.log(JSON.stringify(response));
    callback(null, response);
  } catch (error) {
    console.log("------ERROR------");
    console.log(error);
  }
}
