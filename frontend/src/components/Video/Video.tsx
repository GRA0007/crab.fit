'use client'

import { useState } from 'react'

import { useTranslation } from '/src/i18n/client'
import video_thumb from '/src/res/video_thumb.webp'

import styles from './Video.module.scss'

const Video = () => {
  const { t } = useTranslation('common')
  const [isPlaying, setIsPlaying] = useState(false)

  return isPlaying ? (
    <div className={styles.videoWrapper}>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/yXGd4VXZzcY?modestbranding=1&rel=0&autoplay=1"
        title={t('video.title')}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  ) : (
    <a
      className={styles.preview}
      href="https://www.youtube.com/watch?v=yXGd4VXZzcY"
      target="_blank"
      rel="nofollow noreferrer"
      onClick={e => {
        e.preventDefault()
        setIsPlaying(true)
      }}
    >
      <img src={video_thumb.src} width={video_thumb.width} height={video_thumb.height} alt={t('video.button')} />
      <span>{t('video.button')}</span>
    </a>
  )
}

export default Video
