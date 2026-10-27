import Icon from './Icon'
import { merge } from '../config/merge'

// Reads the LLM button object: { style, size, shape, alignment, show_icon, icon_position }
export default function Button({ cfg, children, onClick, href, full, className = '', ...rest }) {
  const b = merge({ style: 'filled', size: 'medium', shape: 'rounded', show_icon: false, icon_position: 'right' }, cfg)
  const cls = `btn btn-${b.style} btn-${b.size} shape-${b.shape} ${full ? 'btn-full' : ''} ${className}`
  const icon = b.show_icon ? <Icon name="arrow" size={16} /> : null
  const inner = (<>{b.icon_position === 'left' && icon}<span>{children}</span>{b.icon_position !== 'left' && icon}</>)
  return href
    ? <a className={cls} href={href} onClick={onClick} {...rest}>{inner}</a>
    : <button type="button" className={cls} onClick={onClick} {...rest}>{inner}</button>
}
