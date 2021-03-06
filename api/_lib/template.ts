import marked from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

function getCss(theme: string, fontSize: string) {
  let background = '#ffffff'
  let radial = '#dde1e4'

  if (theme === 'dark') {
    background = '#17171d'
    radial = '#273444'
  }

  return `
    @font-face {
      font-family: 'Phantom Sans';
      src: url('https://hackclub.com/fonts/Phantom_Sans_0.6/Regular.woff')
          format('woff'),
        url('https://hackclub.com/fonts/Phantom_Sans_0.6/Regular.woff2')
          format('woff2');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Phantom Sans';
      src: url('https://hackclub.com/fonts/Phantom_Sans_0.6/Bold.woff')
          format('woff'),
        url('https://hackclub.com/fonts/Phantom_Sans_0.6/Bold.woff2')
          format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    body {
      background: ${background};
      background-image: radial-gradient(circle at 25px 25px, ${radial} 3%, transparent 0%),   
        radial-gradient(circle at 75px 75px, ${radial} 3%, transparent 0%);
      background-size: 100px 100px;
      height: 100vh;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-family: 'Phantom Sans', sans-serif;
      font-size: ${sanitizeHtml(fontSize)};
      font-style: normal;
    }

    code {
      font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif;
      font-size: .875em;
      white-space: pre-wrap;
    }

    code:before, code:after {
      content: '\`';
    }

    .img-wrapper {
      margin: 50px 0 50px;
      padding-top: 75px;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
    }

    .img {
      width: 200px;
      height: 200px;
    }
    .img[src*="//dl.airtable.com/"],
    .img[src*="//github.com/"] {
      border-radius: 75px;
      width: 150px;
      height: 150px;
    }

    .plus {
      color: #7a8c97;
      font-size: 75px;
      padding: 0 25px;
    }

    .container {
      margin: 100px 150px 150px;
    }

    .spacer {
      margin: 50px 0;
      width: 100%;
    }

    .brand {
      font-size: 105px;
      padding: 50px;
      text-align: center;
      font-weight: bold;
      position: absolute;
      top: 0;
      width: 100%;
      color: #ec3750;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .brand span {
      color: #7a8c97;
      font-weight: normal;
      margin-right: 0.2em;
    }
    .logo {
      width: 125px;
      margin: 0 50px;
    }
    
    .heading {
      background-image: linear-gradient(to bottom right, #ff8c37, #ec3750 66%);
      background-repeat: no-repeat;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 50px;
      padding-bottom: 25px;
      line-height: 0.875;
      font-weight: bold;
    }

    .heading * {
      margin: 0;
    }

    .caption {
      font-size: ${Number(sanitizeHtml(fontSize).match(/\d+/)) * 0.375}px;
      text-transform: uppercase;
      color: #7a8c97;
      letter-spacing: 0;
    }
    
    .emoji {
      height: 1em;
      width: 1em;
      margin: 0 .05em 0 .1em;
      vertical-align: -0.1em;
    }`
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, brand, images, caption } = parsedReq
  return `<!DOCTYPE html>
  <html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCss(theme, fontSize)}
  </style>
  <body>
    <div class="brand">
      <img class="logo" src="https://hackclub.com/icon/icon-masked.png">
      ${
        brand.length > 0 && brand !== 'undefined'
          ? `<span>Hack Club</span> ${brand || 'Workshops'}`
          : `Hack Club`
      }
    </div>
    <div class="container">
      ${
        images.length > 0
          ? `<div class="img-wrapper">
              <img class="img" src="${sanitizeHtml(images[0])}" />
              ${images.slice(1).map(img => {
                return `<div class="plus">+</div>
                <img class="img" src="${sanitizeHtml(img)}" />`
              })}
            </div>`
          : '<div class="spacer"></div>'
      }
      <div class="heading">${emojify(
        md ? marked(text) : sanitizeHtml(text)
      )}</div>
      ${
        caption && caption !== 'undefined'
          ? `<div class="caption">${emojify(sanitizeHtml(caption))}</div>`
          : ''
      }
    </div>
  </body>
</html>`
}
