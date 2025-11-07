import { useMediaQuery } from '@darkroom.engineering/hamo'
import cn from 'clsx'
import { useStore } from 'lib/store'
import { useEffect, useState } from 'react'
import s from './intro.module.scss'

export const Intro = () => {
  const isMobile = useMediaQuery('(max-width: 800px)')
  const [isLoaded, setIsLoaded] = useState(false)
  const [scroll, setScroll] = useState(false)
  const introOut = useStore(({ introOut }) => introOut)
  const setIntroOut = useStore(({ setIntroOut }) => setIntroOut)
  const lenis = useStore(({ lenis }) => lenis)

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 1000)
  }, [])

  useEffect(() => {
    if (isMobile) {
      lenis.start()
      document.documentElement.classList.toggle('intro', false)
      return
    }

    if (!scroll) {
      document.documentElement.classList.toggle('intro', true)
    }

    if (!lenis) return
    if (scroll) {
      lenis.start()
      document.documentElement.classList.toggle('intro', false)
    } else {
      setTimeout(() => {
        lenis.stop()
      }, 0)

      document.documentElement.classList.toggle('intro', true)
    }
  }, [scroll, lenis, isMobile])

  return (
    <div
      className={cn(s.wrapper, isLoaded && s.out)}
      onTransitionEnd={(e) => {
        e.target.classList.forEach((value) => {
          if (value.includes('out')) {
            setScroll(true)
          }
          if (value.includes('show')) {
            setIntroOut(true)
          }
        })
      }}
    >
      <div className={cn(isLoaded && s.relative)}>
        <NeC isLoaded={isLoaded} fill={'var(--black)'} />
        <LS
          isLoaded={isLoaded}
          fill={'var(--black)'}
          className={cn(introOut && s.translate)}
        />
      </div>
    </div>
  )
}

export const Title = ({ className }) => {
  const introOut = useStore(({ introOut }) => introOut)

  return (
    <div className={className}>
      <NeC fill={'var(--orange)'} />
      <LS
        fill={'var(--orange)'}
        className={cn(introOut && s.translate, s.mobile)}
      />
    </div>
  )
}

const NeC = ({ isLoaded, className, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 254 60"
      className={cn(s.lns, className)}
    >
      <g fill={fill}>
        {/* N */}
        <path
          className={cn(s.start, isLoaded && s.show)}
          style={{ '--index': 1 }}
          d="M0.000264244 58.8158V0.903564H9.44694L40.5799 40.5796H38.362V0.903564H50.1909V58.8158H40.8263L9.69338 19.0576H11.8291V58.8158H0.000264244Z"
        />
        {/* e */}
        <path
          className={cn(s.start, isLoaded && s.show)}
          style={{ '--index': 2 }}
          d="M128.417 59.7194C123.652 59.7194 119.545 58.8706 116.095 57.1729C112.7 55.4205 110.071 52.9835 108.209 49.862C106.402 46.6857 105.498 42.9618 105.498 38.6903C105.498 34.5283 106.374 30.8865 108.127 27.765C109.879 24.5887 112.316 22.1244 115.438 20.3719C118.614 18.5647 122.201 17.6611 126.199 17.6611C130.142 17.6611 133.537 18.51 136.385 20.2076C139.232 21.8505 141.423 24.2054 142.956 27.2721C144.544 30.3389 145.339 33.9806 145.339 38.1974V41.3189H115.684V34.9116H136.385L135.07 36.0616C135.07 32.7211 134.331 30.202 132.852 28.5043C131.429 26.7519 129.375 25.8756 126.692 25.8756C124.665 25.8756 122.94 26.3411 121.516 27.2721C120.093 28.2031 118.997 29.5448 118.231 31.2972C117.464 33.0496 117.081 35.158 117.081 37.6224V38.2795C117.081 41.0725 117.491 43.3725 118.313 45.1797C119.189 46.9322 120.476 48.2465 122.174 49.1227C123.926 49.9989 126.089 50.437 128.663 50.437C130.854 50.437 133.072 50.1084 135.317 49.4513C137.562 48.7941 139.588 47.781 141.396 46.4119L144.681 54.7085C142.655 56.2419 140.163 57.4741 137.206 58.4051C134.304 59.2813 131.374 59.7194 128.417 59.7194Z"
        />
        {/* C */}
        <path
          className={cn(s.start, isLoaded && s.show)}
          style={{ '--index': 3 }}
          d="M234.339 59.7194C228.096 59.7194 222.756 58.4872 218.32 56.0229C213.885 53.5585 210.462 50.1084 208.052 45.6726C205.698 41.182 204.52 35.8973 204.52 29.8186C204.52 23.7399 205.698 18.4826 208.052 14.0468C210.462 9.61094 213.885 6.16085 218.32 3.6965C222.756 1.23215 228.096 -2.88449e-05 234.339 -2.88449e-05C238.172 -2.88449e-05 241.841 0.602368 245.346 1.80716C248.851 3.01195 251.726 4.65485 253.971 6.73586L250.028 16.8397C247.564 14.923 245.072 13.5265 242.553 12.6503C240.089 11.7193 237.488 11.2538 234.75 11.2538C229.273 11.2538 225.111 12.8694 222.263 16.1004C219.416 19.2767 217.992 23.8494 217.992 29.8186C217.992 35.7878 219.416 40.3879 222.263 43.619C225.111 46.85 229.273 48.4655 234.75 48.4655C237.488 48.4655 240.089 48.0274 242.553 47.1512C245.072 46.2202 247.564 44.7964 250.028 42.8797L253.971 52.9835C251.726 55.0645 248.851 56.7074 245.346 57.9122C241.841 59.117 238.172 59.7194 234.339 59.7194Z"
        />
      </g>
    </svg>
  )
}

const LS = ({ isLoaded, className, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 254 60"
      className={cn(s.ei, className)}
    >
      <g fill={fill}>
        {/* L */}
        <path
          className={cn(s.start, isLoaded && s.show)}
          style={{ '--index': 4 }}
          d="M61.8497 58.8158V0.903564H74.5822V48.0548H101.361V58.8158H61.8497Z"
        />
        {/* S */}
        <path
          className={cn(s.start, isLoaded && s.show)}
          style={{ '--index': 5 }}
          d="M174.322 59.7194C171.31 59.7194 168.38 59.4456 165.532 58.8979C162.739 58.4051 160.138 57.6931 157.728 56.7622C155.319 55.7764 153.21 54.6264 151.403 53.3121L155.1 43.2904C156.852 44.4952 158.741 45.5357 160.768 46.4119C162.794 47.2881 164.957 47.9727 167.257 48.4655C169.557 48.9036 171.912 49.1227 174.322 49.1227C178.319 49.1227 181.167 48.5203 182.865 47.3155C184.562 46.0559 185.411 44.4952 185.411 42.6332C185.411 41.5927 185.137 40.6891 184.59 39.9224C184.097 39.1558 183.248 38.4986 182.043 37.951C180.893 37.3486 179.305 36.8557 177.279 36.4724L167.996 34.5009C162.739 33.4056 158.824 31.5437 156.25 28.915C153.731 26.2316 152.471 22.7268 152.471 18.4005C152.471 14.6765 153.457 11.4455 155.428 8.70734C157.454 5.96917 160.22 3.8334 163.725 2.30003C167.285 0.766658 171.364 -2.88449e-05 175.964 -2.88449e-05C178.648 -2.88449e-05 181.222 0.273788 183.686 0.82142C186.15 1.31429 188.423 2.0536 190.504 3.03934C192.585 4.02508 194.392 5.20249 195.926 6.57157L192.229 15.9361C190.039 14.1837 187.574 12.8694 184.836 11.9931C182.098 11.0622 179.113 10.5967 175.882 10.5967C173.582 10.5967 171.611 10.8979 169.968 11.5003C168.38 12.1027 167.148 12.9515 166.271 14.0468C165.45 15.142 165.039 16.4016 165.039 17.8254C165.039 19.4136 165.614 20.7005 166.764 21.6863C167.914 22.672 169.913 23.4661 172.761 24.0685L182.043 26.0399C187.41 27.19 191.408 29.0519 194.036 31.6258C196.665 34.1449 197.979 37.4855 197.979 41.6475C197.979 45.2619 196.994 48.4381 195.022 51.1763C193.105 53.8597 190.367 55.9681 186.808 57.5015C183.303 58.9801 179.141 59.7194 174.322 59.7194Z"
        />
      </g>
    </svg>
  )
}
