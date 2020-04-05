export function parsingHTML(
  html: any,
  title: string,
  desc: string,
  id: string
) {
  return html
    .replace(/<title>(.*)<\/title>/, `<title> ${title} </title>`)
    .replace(
      /<html lang="(.*)"><head><meta charset="utf-8"\/>/,
      `
      <html lang=kor><head><meta charset="utf-8" /> <meta name="og:title" content="${title}" /> <meta name="og:description" content="${desc}" /> <meta name="description" content="${desc}" /> <meta property="og:type" content="website" /> <meta property="og:url" content="https://uzihoon.com/#/post/${id}" /> <meta property="og:site_name" content="Uzihoon" />
    `
    );
}
