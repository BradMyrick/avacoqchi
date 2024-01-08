// Accounts.tsx
import type { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import type { Web3ReactHooks } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { COQ_ADDRESS } from '../constants'


function useBalances(
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  accounts?: string[]
): BigNumber[] | undefined {
  const [balances, setBalances] = useState<BigNumber[] | undefined>()

  useEffect(() => {
    if (provider && accounts?.length) {
      let stale = false

      // get balances from COQ contract
      const contract = new ethers.Contract(COQ_ADDRESS, ['function balanceOf(address) view returns (uint256)'], provider)
      Promise.all(accounts.map((account) => contract.balanceOf(account))).then((balances) => {
        if (!stale) {
          setBalances(balances)
        }
      })

      return () => {
        stale = true
        setBalances(undefined)
      }
    }
  }
  , [provider, accounts])

  return balances
}

export function Accounts({
  accounts,
  provider,
}: {
  accounts: ReturnType<Web3ReactHooks['useAccounts']>
  provider: ReturnType<Web3ReactHooks['useProvider']>
}) {
  const balances = useBalances(provider, accounts)

  if (accounts === undefined) return null

  return (
    <div>
      Accounts:{' '}
      <b>
        {accounts.length === 0
          ? 'None'
          : accounts?.map((account, i) => (
              <ul key={account} style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {account}
                {balances?.[i] ? ` (COQ:${formatEther(balances[i])})` : null}
              </ul>
            ))}
      </b>
    </div>
  )
}
