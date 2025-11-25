import cn from 'clsx'
import s from './card.module.scss'

export const Card = ({
  number,
  text,
  className,
  inverted,
  background = 'rgba(14, 14, 14, 0.15)',
}) => {
  return (
    <div
      className={cn(className, s.wrapper, inverted && s.inverted)}
      style={{ '--background': background }}
    >
      {/* Blur layer - stationary, only fades */}
      <div className={s.blurLayer} />

      {/* Content layer - can be positioned on top */}
      <div className={s.contentLayer}>
        {number && (
          <p className={s.number}>{number.toString().padStart(2, '0')}</p>
        )}
        {text && <p className={s.text}>{text}</p>}
      </div>
    </div>
  )
}
