import cn from 'clsx'
import { Button } from 'components/button'
import { Link } from 'components/link'
import { usePortfolioData } from 'hooks/use-portfolio-data'
import dynamic from 'next/dynamic'
import s from './footer.module.scss'

const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })

export const Footer = () => {
  const { profile } = usePortfolioData()
  const { name, social } = profile

  return (
    <footer className={cn('theme-light', s.footer)}>
      <div className={cn(s.top, 'layout-grid hide-on-mobile')}>
        <p className={cn(s['first-line'], 'h1')}>
          Let's <br />
          <span className="contrast">Connect</span>
        </p>
        {/* <div className={s['shameless-plug']}>
          <p className="h4">Studio Freight</p>
          <p className="p-s">
            An independent creative <br /> studio built on principle
          </p>
        </div> */}
        <p className={cn(s['last-line'], 'h1')}>
          & open to <span className="hide-on-desktop">&nbsp;</span> new <br />{' '}
          opportunities
        </p>
        <Button
          className={s.cta}
          arrow
          icon={<GitHub />}
          href={social.github}
        >
          Get in touch
        </Button>
      </div>
      <div className={cn(s.top, 'layout-block hide-on-desktop')}>
        {/* <div className={s['shameless-plug']}>
          <p className="h4">Studio Freight</p>
          <p className="p-s">
            An independent creative <br /> studio built on principle
          </p>
        </div> */}
        <p className={cn(s['first-line'], 'h1')}>
          Let's <br />
          <span className="contrast">Connect</span>
          <br /> & open to <br /> new opportunities
        </p>
      </div>
      <div className={s.bottom}>
        <div className={s.links}>
          <Link className={cn(s.link, 'p-xs')} href={social.twitter}>
            X
          </Link>
          <Link className={cn(s.link, 'p-xs')} href={social.github}>
            GitHub
          </Link>
          <Link className={cn(s.link, 'p-xs')} href={social.website}>
            Website
          </Link>
        </div>
        <p className={cn('p-xs', s.tm)}>
          <span>©</span> {new Date().getFullYear()} {name}
        </p>
        <Button
          className={cn(s.cta, 'hide-on-desktop')}
          arrow
          icon={<GitHub />}
          href="#contact"
        >
          Get in touch
        </Button>
      </div>
    </footer>
  )
}
