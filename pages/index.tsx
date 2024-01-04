import CoinbaseWalletCard from '../components/connectorCards/CoinbaseWalletCard'
import MetaMaskCard from '../components/connectorCards/MetaMaskCard'
import WalletConnectV2Card from '../components/connectorCards/WalletConnectV2Card'
import Provider from '../components/Provider'

export default function Home() {
  return (
    <>
      <Provider />
      <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
        <MetaMaskCard />
        <WalletConnectV2Card />
        <CoinbaseWalletCard />
      </div>
    </>
  )
}
