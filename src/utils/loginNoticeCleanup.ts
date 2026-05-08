export function withoutTemporaryPasswordNotice(html: string): string {
  if (html.includes('id="login-temporary-password-notice-cleanup"')) return html

  const style = `
<style id="login-temporary-password-notice-cleanup">
  #reset-notice { display: none !important; }
</style>`

  return html.includes('</head>') ? html.replace('</head>', style + '</head>') : style + html
}
