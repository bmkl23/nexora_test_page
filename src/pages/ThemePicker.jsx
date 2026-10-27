import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { designsApi } from '../api/client'
import { merge } from '../config/merge'
import { DEFAULT_THEME } from '../config/defaults'
import { fontStack, radius } from '../theme/tokens'

export const SELECTED_KEY = 'nexora.selectedDesign'
const unwrap = (list) => (Array.isArray(list) ? list : list?.designs || list?.items || [])

function Preview({ config }) {
  const t = merge(DEFAULT_THEME, config?.theme)
  const hero = config?.home_page?.hero
  const r = radius(t.global_border_radius)
  const bar = (on) => <i style={{ background: on ? t.primary_color : t.border_color }} />
  return (
    <div className="pv" style={{ background: t.background_color, borderRadius: r + 4 }}>
      <div className="pv-bars">{bar(true)}{bar()}{bar()}</div>
      <div className="pv-hero" style={{ background: `linear-gradient(135deg, ${t.primary_color}, ${t.secondary_color})`, borderRadius: r, color: '#fff', fontFamily: fontStack(t.typography.font_family).css }}>
        <b>New Season</b>
        <span className="pv-btn" style={{ borderRadius: hero?.primary_button?.shape === 'square' ? 3 : 999, background: t.background_color, color: t.text_color }}>Shop</span>
      </div>
      <div className="pv-cards">{[0, 1, 2].map((i) => <i key={i} style={{ background: t.surface_color, border: `1px solid ${t.border_color}`, borderRadius: r }} />)}</div>
    </div>
  )
}

export default function ThemePicker() {
  const nav = useNavigate()
  const [designs, setDesigns] = useState([])
  const [selected, setSelected] = useState(() => Number(localStorage.getItem(SELECTED_KEY)) || null)
  const [state, setState] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [modal, setModal] = useState(false)
  const [desc, setDesc] = useState('')
  const [busy, setBusy] = useState(false)
  const [genError, setGenError] = useState('')

  const load = useCallback(async (selectNewest = false) => {
    setState('loading')
    try {
      const list = unwrap(await designsApi.list())
      setDesigns(list)
      setSelected((s) => (selectNewest && list.length ? list[list.length - 1].id : (list.some((d) => d.id === s) ? s : list[0]?.id ?? null)))
      setState('ready')
    } catch (e) { setError(e.message); setState('error') }
  }, [])
  useEffect(() => { load() }, [load])

  const generate = async () => {
    setBusy(true); setGenError('')
    try { await designsApi.create(desc.trim()); setModal(false); setDesc(''); await load(true) }
    catch (e) { setGenError(e.message) }
    finally { setBusy(false) }
  }
  const proceed = () => { localStorage.setItem(SELECTED_KEY, String(selected)); nav('/shop') }

  return (
    <main className="picker">
      <p className="picker-eyebrow">NexOra configuration</p>
      <h1>Choose your store theme</h1>

      {state === 'loading' && <p className="picker-note" role="status">Loading themes…</p>}
      {state === 'error' && (
        <div className="picker-error" role="alert">
          <p><b>Could not load themes.</b> {error}</p>
          <button className="pbtn" onClick={() => load()}>Try again</button>
        </div>
      )}
      {state === 'ready' && !designs.length && <p className="picker-note">No themes yet. Create one to get started.</p>}

      {state === 'ready' && designs.length > 0 && (
        <div className="picker-row" role="radiogroup" aria-label="Themes">
          {designs.map((d, i) => {
            const on = d.id === selected
            const t = merge(DEFAULT_THEME, d.config?.theme)
            return (
              <div key={d.id} role="radio" aria-checked={on} tabIndex={0} className={`pcard2 ${on ? 'on' : ''}`}
                onClick={() => setSelected(d.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(d.id)}>
                <Preview config={d.config} />
                <div className="pcard2-foot">
                  <div><b>Theme {i + 1}</b><span>{fontStack(t.typography.font_family).family}</span></div>
                  <span className={`pill ${on ? 'on' : ''}`}>{on ? 'Selected' : 'Select'}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="picker-actions">
        <button className="pbtn ghost" onClick={() => setModal(true)}>Create new theme</button>
        <button className="pbtn" disabled={!selected} onClick={proceed}>Continue with selected theme</button>
      </div>

      {modal && (
        <div className="modal-bg" onClick={() => !busy && setModal(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mt" onClick={(e) => e.stopPropagation()}>
            <h2 id="mt">Create a new theme</h2>
            <p>Describe the design you want to generate.</p>
            <label htmlFor="dd">Design description</label>
            <textarea id="dd" rows={6} value={desc} onChange={(e) => setDesc(e.target.value)} disabled={busy}
              placeholder="Example: Make it minimal with warm colors and rounded cards" />
            {genError && <p className="picker-error-inline" role="alert">{genError}</p>}
            {busy && <p className="picker-note" role="status">Generating. This can take a minute…</p>}
            <div className="modal-actions">
              <button className="pbtn ghost" onClick={() => setModal(false)} disabled={busy}>Cancel</button>
              <button className="pbtn" onClick={generate} disabled={busy || desc.trim().length < 10}>{busy ? 'Generating…' : 'Generate theme'}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
