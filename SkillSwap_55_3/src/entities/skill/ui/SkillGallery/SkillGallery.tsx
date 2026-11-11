import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { SwiperRef } from 'swiper/react'

import 'swiper/css'

import ChevronRight from '../../../../shared/assets/icons/icon-chevron-right.svg?react'

import styles from './SkillGallery.module.css'

export type SkillGalleryProps = {
  images: string[]
}

const VISIBLE_THUMBS = 3

export const SkillGallery = ({ images }: SkillGalleryProps) => {
  const swiperRef = useRef<SwiperRef | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Защищаем галерею от некорректных данных во время выполнения.
  const validImages = Array.isArray(images)
    ? images.filter(
        (image): image is string => typeof image === 'string' && image.trim().length > 0,
      )
    : []

  if (validImages.length === 0) {
    return null
  }

  // Для одной картинки слайдер, миниатюры и навигация не нужны.
  if (validImages.length === 1) {
    return (
      <div className={styles.main}>
        <img src={validImages[0]} alt="Изображение навыка" />
      </div>
    )
  }

  const thumbImages = validImages.slice(1)
  const hasMore = thumbImages.length > VISIBLE_THUMBS
  const visibleThumbs = thumbImages.slice(0, VISIBLE_THUMBS)
  const hiddenCount = thumbImages.length - VISIBLE_THUMBS

  // Переключаем главное изображение через API Swiper.
  const showImage = (index: number) => {
    swiperRef.current?.swiper.slideTo(index)
  }

  const showPreviousImage = () => {
    swiperRef.current?.swiper.slidePrev()
  }

  const showNextImage = () => {
    swiperRef.current?.swiper.slideNext()
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Swiper
          ref={swiperRef}
          className={styles.swiper}
          rewind
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {validImages.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`}>
              <img src={image} alt={`Изображение навыка ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Навигация отображается только при наличии нескольких изображений. */}
        <button
          type="button"
          className={clsx(styles.arrow, styles.arrowPrev)}
          onClick={showPreviousImage}
          aria-label="Показать предыдущее изображение"
        >
          <ChevronRight className={styles.arrowPrevIcon} />
        </button>

        <button
          type="button"
          className={clsx(styles.arrow, styles.arrowNext)}
          onClick={showNextImage}
          aria-label="Показать следующее изображение"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Миниатюры позволяют быстро перейти к нужному изображению. */}
      <div className={styles.thumbs}>
        {visibleThumbs.map((image, index) => {
          const imageIndex = index + 1
          const isActive = activeIndex === imageIndex
          const isLastVisibleThumb = hasMore && index === visibleThumbs.length - 1

          return (
            <button
              type="button"
              className={clsx(styles.thumb, {
                [styles.thumbActive]: isActive,
              })}
              onClick={() => showImage(imageIndex)}
              aria-label={`Показать изображение ${imageIndex + 1}`}
              key={`${image}-${imageIndex}`}
            >
              <img src={image} alt="" />

              {isLastVisibleThumb && <span className={styles.thumbOverlay}>+{hiddenCount}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
