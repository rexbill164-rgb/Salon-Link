// Renderer kept minimal - all pages use direct HTML strings
export const renderer = async (_c: any, next: any) => { await next() }
