// Single source of truth for which image hosts product photos may come
// from. Used by next.config.ts (to configure next/image's remotePatterns)
// and by lib/validations.ts (so a product can't be saved with an image URL
// that next/image would then refuse to render).
export const ALLOWED_IMAGE_HOSTS = ["images.unsplash.com"];
