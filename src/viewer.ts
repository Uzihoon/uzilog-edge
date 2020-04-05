import { Context } from "aws-lambda";

const regex = /aolbuild|baidu|bingbot|bingpreview|msnbot|duckduckgo|adsbot-google|googlebot|mediapartners-google|teoma|slurp|yandex|bot|crawl|spider/g;

export async function request(event: any, context: Context, callback: any) {
  const request = event.Records[0].cf.request;
  const user_agent = request.headers["user-agent"][0]["value"].toLowerCase();

  if (user_agent) {
    const found = user_agent.match(regex);
    request.headers["is-crawler"] = [
      {
        key: "is-crawler",
        value: `${!!found}`
      }
    ];
  }

  callback(null, request);
}
