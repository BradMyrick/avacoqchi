// Card.tsx
import type { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import type { Web3ReactHooks } from '@web3-react/core';
import type { MetaMask } from '@web3-react/metamask';
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

import { getName } from '../utils';
import { Accounts } from './Accounts';
import { Chain } from './Chain';
import { ConnectWithSelect } from './ConnectWithSelect';
import { Status } from './Status';

interface Props {
  connector: MetaMask | WalletConnectV2 | CoinbaseWallet;
  activeChainId: ReturnType<Web3ReactHooks['useChainId']>;
  chainIds?: ReturnType<Web3ReactHooks['useChainId']>[];
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
  isActive: ReturnType<Web3ReactHooks['useIsActive']>;
  error: Error | undefined;
  setError: (error: Error | undefined) => void;
  ENSNames: ReturnType<Web3ReactHooks['useENSNames']>;
  provider?: ReturnType<Web3ReactHooks['useProvider']>;
  accounts?: string[];
}

export function Card({
  connector,
  activeChainId,
  chainIds,
  isActivating,
  isActive,
  error,
  setError,
  ENSNames,
  accounts,
  provider,
}: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <b>{getName(connector)}</b>
        <Status isActivating={isActivating} isActive={isActive} error={error} />
      </div>
      <Chain chainId={activeChainId} />
      <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      <ConnectWithSelect
        connector={connector}
        activeChainId={activeChainId}
        chainIds={chainIds}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        setError={setError}
      />

      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1rem;
          margin-bottom: 1rem;
          background: #fff;
          border: 1px solid #eaeaea;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
