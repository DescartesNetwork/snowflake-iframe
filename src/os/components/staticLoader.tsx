import { Suspense, forwardRef, cloneElement, useState, useEffect } from 'react'
import { RemoteModule } from '@sentre/react-dynamic-remote-component'

import { Spin } from 'antd'
import ErrorBoundary from 'os/components/errorBoundary'

import { useRootSelector, RootState } from 'os/store'

/**
 * Remote Static
 */
type StaticType = 'logo' | 'readme'
type MultiStaticType = 'panels'

/**
 * Load asset json
 */
const useRemoteStatic = ({ url, scope }: RemoteModule): any => {
  const [data, setData] = useState({})

  useEffect(() => {
    const root = url.replace('index.js', '')
    const prefix = (asset: string | string[]) => {
      if (typeof asset === 'string') return root + asset
      if (Array.isArray(asset)) return asset.map((value) => root + value)
      throw new Error('Invalid static asset')
    }
    ;(async () => {
      try {
        const res = await fetch(root + `${scope}-asset-senhub.json`)
        let data = await res.json()
        Object.keys(data).forEach((key) => (data[key] = prefix(data[key])))
        return setData(data)
      } catch (er) {
        return setData({})
      }
    })()
  }, [url, scope])

  return data
}

const RemoteStatic = forwardRef<
  HTMLElement,
  {
    type?: StaticType
    manifest: RemoteModule
    render: (src: string) => JSX.Element
  }
>(({ type = 'default', manifest, render }, ref) => {
  const { [type]: src } = useRemoteStatic(manifest)
  return cloneElement(render(src), ref ? { ref } : {})
})

/**
 * Static Loader
 */
export const StaticLoader = forwardRef<
  HTMLElement,
  {
    appId: string
    type: StaticType
    defaultData?: string
    render: (url: string) => JSX.Element
  }
>(({ type, appId, defaultData = '', render }, ref) => {
  const { register } = useRootSelector((state: RootState) => state.page)
  const url = register[appId]?.url || ''
  const manifest: RemoteModule = { url, scope: appId, module: './static' }
  if (!url) return null
  return (
    <ErrorBoundary defaultChildren={render(defaultData)}>
      <Suspense fallback={<Spin size="small" />}>
        <RemoteStatic
          type={type}
          manifest={manifest}
          render={render}
          ref={ref}
        />
      </Suspense>
    </ErrorBoundary>
  )
})

/**
 * Remote Multi Statics
 */
const RemoteMultiStatic = forwardRef<
  HTMLElement,
  {
    type?: MultiStaticType
    manifest: RemoteModule
    render: (src: string[]) => JSX.Element
  }
>(({ type = 'default', manifest, render }, ref) => {
  const { [type]: arrSrc } = useRemoteStatic(manifest)
  return cloneElement(render(arrSrc || []), ref ? { ref } : {})
})

/**
 * Remote Multi Loader
 */
export const MultiStaticLoader = forwardRef<
  HTMLElement,
  {
    appId: string
    type: MultiStaticType
    defaultData?: string[]
    render: (url: string[]) => JSX.Element
  }
>(({ type, appId, defaultData = [''], render }, ref) => {
  const { register } = useRootSelector((state: RootState) => state.page)
  const url = register[appId]?.url || ''
  const manifest: RemoteModule = { url, scope: appId, module: './static' }
  if (!url) return null
  return (
    <ErrorBoundary defaultChildren={render(defaultData)}>
      <Suspense fallback={<Spin size="small" />}>
        <RemoteMultiStatic
          type={type}
          manifest={manifest}
          render={render}
          ref={ref}
        />
      </Suspense>
    </ErrorBoundary>
  )
})
