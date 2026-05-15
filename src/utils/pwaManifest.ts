export function salonLinkManifest() {
  return {
    name: 'SalonLink',
    short_name: 'SalonLink',
    description: "Ghana's beauty booking app",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#40546c',
    theme_color: '#40546c',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ]
  }
}

export function iconSvg(size = 512) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="112" fill="#40546c"/>
    <text x="256" y="292" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="78" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="8" paint-order="stroke fill">SalonLink</text>
  </svg>`
}

export function splashSvg(width = 1170, height = 2532) {
  const fontSize = Math.round(Math.min(width * 0.16, 120))
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#40546c"/>
    <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="10" paint-order="stroke fill">SalonLink</text>
  </svg>`
}
