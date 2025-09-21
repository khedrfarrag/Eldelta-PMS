'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BlogImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  unoptimized?: boolean
}

export default function BlogImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "w-full h-auto aspect-video object-cover",
  priority = false,
  unoptimized = false
}: BlogImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      console.log('Image failed to load:', src)
      setImageSrc('/blog/cover-placeholder.svg')
      setHasError(true)
    }
  }

  return (
    <Image 
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={unoptimized}
      onError={handleError}
    />
  )
}
