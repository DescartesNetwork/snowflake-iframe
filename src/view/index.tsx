import { useEffect } from 'react'
import { useUI } from '@sentre/senhub'

import EmbededView from '@sentre/embeded-view'

import configs from 'configs'

const {
  manifest: { appId },
} = configs

const View = () => {
  const { setBackground } = useUI()

  useEffect(() => {
    setBackground({ light: '#131a35', dark: '#131a35' })
  }, [setBackground])

  return (
    <EmbededView
      wallet={window.sentre.wallet}
      appId={appId}
      src="https://app.snowflake.so"
      title="Snowflake: Automation Infrastructure for Solana"
    />
  )
}

export default View
