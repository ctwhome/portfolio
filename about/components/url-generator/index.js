import { useState, useEffect } from 'react'
import { compressToEncodedURIComponent } from 'lz-string'
import cn from 'clsx'
import s from './url-generator.module.scss'

export const URLGenerator = ({ data }) => {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Generate URL whenever data changes
    const generateURL = () => {
      try {
        const compressed = compressToEncodedURIComponent(JSON.stringify(data))
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        return `${baseUrl}/?data=${compressed}`
      } catch (error) {
        console.error('Error generating URL:', error)
        return ''
      }
    }

    setUrl(generateURL())
    setCopied(false)
  }, [data])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const openPreview = () => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2 className="h4">Your Portfolio URL</h2>
        <p className="p-s">
          Share this link to showcase your portfolio
        </p>
      </div>

      <div className={s.urlBox}>
        <div className={s.urlText}>
          <code className="p-xs">{url || 'Generating URL...'}</code>
        </div>
        <div className={s.actions}>
          <button
            onClick={copyToClipboard}
            className={cn(s.button, s.copyButton, copied && s.copied)}
            disabled={!url}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={openPreview}
            className={cn(s.button, s.previewButton)}
            disabled={!url}
          >
            Preview →
          </button>
        </div>
      </div>

      <div className={s.info}>
        <div className={s.infoItem}>
          <span className="p-xs">URL Length</span>
          <span className="p-s">{url.length} characters</span>
        </div>
        <div className={s.infoItem}>
          <span className="p-xs">Status</span>
          <span className={cn('p-s', s.status, url && s.ready)}>
            {url ? 'Ready to share' : 'Generating...'}
          </span>
        </div>
      </div>

      <div className={s.instructions}>
        <h3 className="p">How to use:</h3>
        <ol className="p-s">
          <li>Fill in your information in the form</li>
          <li>Copy the generated URL above</li>
          <li>Share it with anyone to showcase your portfolio</li>
          <li>Update the form anytime to generate a new link</li>
        </ol>
      </div>
    </div>
  )
}
