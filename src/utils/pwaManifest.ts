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
    <text x="256" y="292" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="80" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="8" paint-order="stroke fill">SalonLink</text>
  </svg>`
}
