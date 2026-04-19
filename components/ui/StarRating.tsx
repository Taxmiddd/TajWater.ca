'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: string
  className?: string
}

export function StarRating({ rating = 0, maxStars = 5, size = 'w-4 h-4', className = '' }: StarRatingProps) {
  const stars = Array.from({ length: maxStars }, (_, i) => {
    const starRatio = Math.max(0, Math.min(1, rating - i))
    
    // Unique ID for the gradient to avoid conflicts on the same page
    const gradientId = `star-grad-${Math.random().toString(36).slice(2, 9)}`

    return (
      <div key={i} className="relative inline-block">
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset={`${starRatio * 100}%`} stopColor="#fbbf24" />
              <stop offset={`${starRatio * 100}%`} stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
        </svg>
        <Star 
          className={`${size} ${className}`} 
          style={{ fill: `url(#${gradientId})`, stroke: '#fbbf24', strokeWidth: 1 }} 
        />
      </div>
    )
  })

  return <div className="flex items-center">{stars}</div>
}

