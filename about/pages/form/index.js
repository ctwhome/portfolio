import cn from 'clsx'
import { Layout } from 'layouts/default'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { getDefaultData } from 'lib/portfolio-data'
import s from './form.module.scss'

const PortfolioForm = dynamic(
  () => import('components/portfolio-form').then((mod) => mod.PortfolioForm),
  { ssr: false }
)

const URLGenerator = dynamic(
  () => import('components/url-generator').then((mod) => mod.URLGenerator),
  { ssr: false }
)

export default function FormBuilder() {
  const [formData, setFormData] = useState(() => getDefaultData())

  return (
    <Layout
      seo={{
        title: 'Portfolio Builder - Create Your Portfolio',
        description: 'Build and share your own portfolio with a custom URL',
      }}
      className={s.formPage}
    >
      <div className={cn('layout-grid', s.container)}>
        <div className={s.header}>
          <h1 className="h1">Portfolio Builder</h1>
          <p className="p-l">
            Create your own portfolio and get a shareable link
          </p>
        </div>

        <div className={s.content}>
          <div className={s.formSection}>
            <PortfolioForm data={formData} onChange={setFormData} />
          </div>

          <div className={s.urlSection}>
            <URLGenerator data={formData} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
