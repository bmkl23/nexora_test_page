import Art from './Art'

export const isUrl = (s) => typeof s === 'string' && /^(https?:)?\/\/|^data:|^\//.test(s)

// Real image when the API returns a URL, otherwise theme-coloured procedural art.
export default function Img({ src, alt = '', seed = 0, fit = 'cover' }) {
  if (isUrl(src)) return <img src={src} alt={alt} loading="lazy" draggable={false} style={{ objectFit: fit }} />
  return <Art seed={seed} />
}
