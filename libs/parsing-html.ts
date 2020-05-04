export function parsingHTML(
  html: any,
  title: string,
  content: string,
  id: string
) {
  return html
    .replace(/<title>(.*)<\/title>/, `<title>UZILOG-${title}</title>`)
    .replace(
      /<html lang="(.*)"><head><meta charset="utf-8"\/>/,
      `
      <html lang=kor><head><meta charset="utf-8" /> <meta name="og:title" content="${title}" /> <meta name="og:description" content="${content.slice(
        0,
        30
      )}" /> <meta name="description" content="${content.slice(
        0,
        30
      )}" /> <meta property="og:type" content="website" /> <meta property="og:url" content="https://uzihoon.com/#/post/${id}" /> <meta property="og:site_name" content="Uzihoon" />
    `
    )
    .replace(/<body>/, `<body>${content}`);
}
