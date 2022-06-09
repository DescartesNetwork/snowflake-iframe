import EmbededView from 'shared/antd/embededView'

import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

const View = () => {
  return (
    <EmbededView
      appId={appId}
      src="https://app.snowflake.so"
      title="Snowflake: Automation Infrastructure for Solana"
      background={{ light: '#131a35', dark: '#131a35' }}
    />
  )
}

export default View
