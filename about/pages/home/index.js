import { useFrame, useRect } from '@darkroom.engineering/hamo'
import cn from 'clsx'

import { Button } from 'components/button'
import { Card } from 'components/card'
import { Title } from 'components/intro'
import { ListItem } from 'components/list-item'
import { useScroll } from 'hooks/use-scroll'
import { usePortfolioData } from 'hooks/use-portfolio-data'
import { Layout } from 'layouts/default'
import { button, useControls } from 'leva'
import { clamp, mapRange } from 'lib/maths'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useIntersection, useWindowSize } from 'react-use'
import s from './home.module.scss'

// const SFDR = dynamic(() => import('icons/sfdr.svg'), { ssr: false })
const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })
const Sponsor = dynamic(() => import('icons/sponsor.svg'), { ssr: false })

const Parallax = dynamic(
  () => import('components/parallax').then((mod) => mod.Parallax),
  { ssr: false }
)

const AppearTitle = dynamic(
  () => import('components/appear-title').then((mod) => mod.AppearTitle),
  { ssr: false }
)

const HorizontalSlides = dynamic(
  () =>
    import('components/horizontal-slides').then((mod) => mod.HorizontalSlides),
  { ssr: false }
)

const FeatureCards = dynamic(
  () => import('components/feature-cards').then((mod) => mod.FeatureCards),
  { ssr: false }
)

const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

const HeroTextIn = ({ children, introOut }) => {
  return (
    <div className={cn(s['hide-text'], introOut && s['show-text'])}>
      {children}
    </div>
  )
}

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
}

export default function Home() {
  const { profile, skills, projects } = usePortfolioData()
  const [hasScrolled, setHasScrolled] = useState()
  const zoomRef = useRef(null)
  const [zoomWrapperRectRef, zoomWrapperRect] = useRect()
  const { height: windowHeight } = useWindowSize()
  const introOut = useStore(({ introOut }) => introOut)

  const [theme, setTheme] = useState('dark')
  const lenis = useStore(({ lenis }) => lenis)

  useControls(
    'lenis',
    () => ({
      stop: button(() => {
        lenis.stop()
      }),
      start: button(() => {
        lenis.start()
      })
    }),
    [lenis]
  )

  useControls(
    'scrollTo',
    () => ({
      immediate: button(() => {
        lenis.scrollTo(30000, { immediate: true })
      }),
      smoothDuration: button(() => {
        lenis.scrollTo(30000, { lock: true, duration: 10 })
      }),
      smooth: button(() => {
        lenis.scrollTo(30000)
      }),
      forceScrollTo: button(() => {
        lenis.scrollTo(30000, { force: true })
      })
    }),
    [lenis]
  )

  useEffect(() => {
    if (!lenis) return

    function onClassNameChange(lenis) {
      console.log(lenis.className)
    }

    lenis.on('className change', onClassNameChange)

    return () => {
      lenis.off('className change', onClassNameChange)
    }
  }, [lenis])

  useScroll(({ scroll }) => {
    setHasScrolled(scroll > 10)
    if (!zoomWrapperRect.top) return

    const start = zoomWrapperRect.top + windowHeight * 0.5
    const end = zoomWrapperRect.top + zoomWrapperRect.height - windowHeight

    const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
    const center = 0.6
    const progress1 = clamp(0, mapRange(0, center, progress, 0, 1), 1)
    const progress2 = clamp(0, mapRange(center - 0.055, 1, progress, 0, 1), 1)
    setTheme(progress2 === 1 ? 'light' : 'dark')

    zoomRef.current.style.setProperty('--progress1', progress1)
    zoomRef.current.style.setProperty('--progress2', progress2)

    if (progress === 1) {
      zoomRef.current.style.setProperty('background-color', 'currentColor')
    } else {
      zoomRef.current.style.removeProperty('background-color')
    }
  })

  const [whyRectRef, whyRect] = useRect()
  const [cardsRectRef, cardsRect] = useRect()
  const [whiteRectRef, whiteRect] = useRect()
  const [featuresRectRef, featuresRect] = useRect()
  const [inuseRectRef, inuseRect] = useRect()

  const addThreshold = useStore(({ addThreshold }) => addThreshold)

  useEffect(() => {
    addThreshold({ id: 'top', value: 0 })
  }, [])

  useEffect(() => {
    const top = whyRect.top - windowHeight / 2
    addThreshold({ id: 'why-start', value: top })
    addThreshold({
      id: 'why-end',
      value: top + whyRect.height
    })
  }, [whyRect])

  useEffect(() => {
    const top = cardsRect.top - windowHeight / 2
    addThreshold({ id: 'cards-start', value: top })
    addThreshold({ id: 'cards-end', value: top + cardsRect.height })
    addThreshold({
      id: 'red-end',
      value: top + cardsRect.height + windowHeight
    })
  }, [cardsRect])

  useEffect(() => {
    const top = whiteRect.top - windowHeight
    addThreshold({ id: 'light-start', value: top })
  }, [whiteRect])

  useEffect(() => {
    const top = featuresRect.top
    addThreshold({ id: 'features', value: top })
  }, [featuresRect])

  useEffect(() => {
    const top = inuseRect.top
    addThreshold({ id: 'in-use', value: top })
  }, [inuseRect])

  useEffect(() => {
    const top = lenis?.limit
    addThreshold({ id: 'end', value: top })
  }, [lenis?.limit])

  useScroll((e) => {
    console.log(window.scrollY, e.scroll, e.isScrolling, e.velocity, e.isLocked)
  })

  useFrame(() => {
    console.log('frame', window.scrollY, lenis?.scroll, lenis?.isScrolling)
  }, 1)

  const inUseRef = useRef()

  const [visible, setIsVisible] = useState(false)
  const intersection = useIntersection(inUseRef, {
    threshold: 0.2
  })
  useEffect(() => {
    if (intersection?.isIntersecting) {
      setIsVisible(true)
    }
  }, [intersection])

  return (
    <Layout
      theme={theme}
      seo={{
        title: 'Netherlands eScience Center – Portfolio',
        description:
          'Empowering researchers through innovative, open, and sustainable research software.'
      }}
      className={s.home}
    >
      <div className={s.canvas}>
        <WebGL />
      </div>

      <section className={s.hero}>
        <div className="layout-grid-inner">
          <Title className={s.title} />
          {/* <SFDR className={cn(s.icon, introOut && s.show)} /> */}
          <span className={cn(s.sub)}>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('h3', s.subtitle)}>
                Research Software Excellence
              </h2>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('p-xs', s.tm)}>
                <span>©</span> {new Date().getFullYear()} Netherlands eScience
                Center
              </h2>
            </HeroTextIn>
          </span>
        </div>

        <div className={cn(s.bottom, 'layout-grid')}>
          <div
            className={cn(
              'hide-on-mobile',
              s['scroll-hint'],
              hasScrolled && s.hide,
              introOut && s.show
            )}
          >
            <div className={s.text}>
              <HeroTextIn introOut={introOut}>
                <p>scroll</p>
              </HeroTextIn>
              <HeroTextIn introOut={introOut}>
                <p> to explore</p>
              </HeroTextIn>
            </div>
          </div>
          <h1 className={cn(s.description, 'p-s')}>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">Empowering researchers through</p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">innovative, open, and sustainable</p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">research software</p>
            </HeroTextIn>
          </h1>
          <Button
            className={cn(s.cta, s.documentation, introOut && s.in)}
            arrow
            icon={<GitHub />}
            href="https://research-software-directory.org"
          >
            Research Software Directory
          </Button>
          <Button
            className={cn(s.cta, s.sponsor, introOut && s.in)}
            arrow
            icon={<Sponsor />}
            href="https://www.esciencecenter.nl/projects/"
          >
            Our Projects
          </Button>
        </div>
      </section>

      <section className={s.why} data-lenis-scroll-snap-align="start">
        <div className="layout-grid">
          <h2 className={cn(s.sticky, 'h2')}>
            <AppearTitle>Why We Do It</AppearTitle>
          </h2>
          <aside className={s.features} ref={whyRectRef}>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>Our Vision</h3>
              <p className="p">
                A robust, digitally skilled research community where all
                researchers can harness advanced digital technologies to answer
                curiosity-driven questions, keeping the Netherlands at the
                forefront of international science.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>Our Mission</h3>
              <p className="p">
                Enabling digitally enhanced research and empowering researchers
                through innovative research software and knowledge sharing.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>Accelerating Innovation</h3>
              <p className="p">
                The pace of digital innovation is accelerating. Researchers need
                access, skills, and trusted tools to keep up. High-quality,
                sustainable software is fundamental to reproducible science.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>Building Digital Leadership</h3>
              <p className="p">
                Building a digitally skilled research community ensures
                long-term scientific leadership for the Netherlands and drives
                innovation in Dutch and European science policy.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <section className={s.rethink}>
        <div className={cn('layout-grid', s.pre)}>
          <div className={s.highlight} data-lenis-scroll-snap-align="start">
            <Parallax speed={-0.5}>
              <p className="h2">
                <AppearTitle>What We Do</AppearTitle>
              </p>
            </Parallax>
          </div>
          <div className={s.comparison}>
            <Parallax speed={0.5}>
              <p className="p">
                We empower researchers across all disciplines through the
                development of innovative, open, and sustainable research
                software. We bridge science and technology, bringing advanced
                digital tools — from AI to high-performance computing — to
                research in every domain.
              </p>
            </Parallax>
          </div>
        </div>
        <div className={s.cards} ref={cardsRectRef}>
          <HorizontalSlides>
            <Card
              className={s.card}
              number="01"
              text="Software Quality — Building robust, maintainable, and FAIR research software"
            />
            <Card
              className={s.card}
              number="02"
              text="Artificial Intelligence — Advancing research through machine learning and responsible AI"
            />
            <Card
              className={s.card}
              number="03"
              text="Analytics — Transforming data into insights with advanced analytical methods"
            />
            <Card
              className={s.card}
              number="04"
              text="Data Processing — Handling complex data workflows from edge to cloud"
            />
            <Card
              className={s.card}
              number="05"
              text="Computing — Leveraging heterogeneous architectures and high-performance computing"
            />
          </HorizontalSlides>
        </div>
      </section>
      <section
        ref={(node) => {
          zoomWrapperRectRef(node)
          zoomRef.current = node
        }}
        className={s.solution}
      >
        <div className={s.inner}>
          <div className={s.zoom}>
            <h2 className={cn(s.first, 'h1 vh')}>
              The Netherlands <br />
              <span className="contrast">eScience Center</span>
            </h2>
            <h2 className={cn(s.enter, 'h3 vh')}>
              Meet <br /> {profile.name}
            </h2>
            <h2 className={cn(s.second, 'h1 vh')}>{profile.title}</h2>
          </div>
        </div>
      </section>
      <section className={cn('theme-light', s.featuring)} ref={whiteRectRef}>
        <div className={s.inner}>
          <div className={cn('layout-block', s.intro)}>
            <h2 className="h2">{profile.name}</h2>
            <h3 className="h4">{profile.title}</h3>
            <p className="p-l">{profile.bio}</p>
          </div>
        </div>
        <section ref={featuresRectRef}>
          <FeatureCards skills={skills} />
        </section>
      </section>
      <section
        ref={(node) => {
          inuseRectRef(node)
          inUseRef.current = node
        }}
        className={cn('theme-light', s['in-use'], visible && s.visible)}
      >
        <div className="layout-grid">
          <aside className={s.title}>
            <p className="h3">
              <AppearTitle>
                <span>Featured</span>

                <br />
                <span className="grey">Projects</span>
              </AppearTitle>
            </p>
          </aside>
          <ul className={s.list}>
            {projects.map(({ title, source, href }, i) => (
              <li key={i}>
                <ListItem
                  title={title}
                  source={source}
                  href={href}
                  index={i}
                  visible={visible}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      id: 'home'
    } // will be passed to the page component as props
  }
}
