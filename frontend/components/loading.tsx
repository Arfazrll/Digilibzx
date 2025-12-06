'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LoadingPageProps {
  description?: string
}

export default function LoadingComponent({ description }: LoadingPageProps) {
    return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="flex flex-col items-center">
          <Image
            src={`/assets/loading-1.gif`}
            alt="Loading animation"
            width={200}
            height={200}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-center">Loading...</h2>
          {/* {description && (
            <p className="text-gray-600 text-center">{description}</p>
          )} */}
        </div>
      </div>
    </div>
  )
}

