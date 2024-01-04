import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'

import { URLS } from '../chains'

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: "https://coinbase.com",
        appName: 'web3-react',
      },
    })
)
