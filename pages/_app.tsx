// _app.tsx
import '../styles/globals.css';
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'

import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'

const connectors: [MetaMask, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
]


function MyApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider connectors={connectors}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default MyApp;
