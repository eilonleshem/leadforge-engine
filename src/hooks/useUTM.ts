'use client'

import { useEffect, useState } from 'react'

export interface UTMParams {
  utm_source?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

export function useUTM(): UTMParams {
  const [params, setParams] = useState<UTMParams>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    const urlParams = new URLSearchParams(window.location.search)
    const utm: UTMParams = {}

    if (urlParams.get('utm_source')) utm.utm_source = urlParams.get('utm_source')!
    if (urlParams.get('utm_campaign')) utm.utm_campaign = urlParams.get('utm_campaign')!
    if (urlParams.get('utm_content')) utm.utm_content = urlParams.get('utm_content')!
    if (urlParams.get('utm_term')) utm.utm_term = urlParams.get('utm_term')!

    setParams(utm)
  }, [])

  return params
}
