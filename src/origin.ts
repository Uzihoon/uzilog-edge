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
    const { request, response } = event.Records[0].cf;
    const pattern = new UrlPattern("/post(/*)");
    const { headers, uri } = request || {};
    const match = pattern.match(uri);

    if (match && match._) {
      // post로 조회하는 경우
      let is_crawler: string;

      if ("is-crawler" in headers) {
        is_crawler = headers["is-crawler"][0].value.toLowerCase();
      }

      if (is_crawler === "true") {
        const postId = match._;
        const params = {
          TableName: "uzilog",
          Key: { postId }
        };
        const html = await s3
          .getObject({ Bucket: "uzilog-project", Key: "index.html" })
          .promise()
          .then(data => data.Body.toString())
          .catch(err => console.log(err));
        const result: Result = await dynamoDbLib.call("get", params);
        const title = result.Item.title;
        const desc = result.Item.desc;
        const content = result.Item.content;
        response.status = 200;
        response.body = parsingHTML(html, title, desc, postId, content);
        response.headers["content-type"] = [
          {
            key: "Content-Type",
            value: "text/html"
          }
        ];
      }
    }
    console.log(JSON.stringify(response));
    callback(null, response);
  } catch (error) {
    console.log("------ERROR------");
    console.log(error);
  }
}
