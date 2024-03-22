import { intToHex } from '@ethereumjs/util';
import type {
  SendTransactionParams,
  Transaction,
  UserOpBundle,
  UserOpParams
} from '@particle-network/aa';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PublicClient } from 'viem';

import { useConnectProvider } from '../btcContext';
import { EthereumProvider } from '../evmSigner/provider';
import { EventName } from '../types/eventName';
import events from '../utils/eventUtils';
import txConfirm from '../utils/txConfirmUtils';

export const useETHProvider = () => {
  const { evmAccount, smartAccount } = useConnectProvider();
  const [chainId, setChainId] = useState<number>();

  useEffect(() => {
    if (smartAccount) {
      const newChainId = (smartAccount.provider as any).chainId as number;
      setChainId(newChainId);

      const onChangeChange = (id: string) => {
        setChainId(Number(id));
      };
      smartAccount.provider.on('chainChanged', onChangeChange);
      return () => {
        smartAccount.provider.removeListener('chainChanged', onChangeChange);
      };
    }
  }, [smartAccount]);

  const switchChain = useCallback(
    async (switchChainId: number) => {
      if (smartAccount?.provider) {
        await smartAccount.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: intToHex(switchChainId)
            }
          ]
        });
      }
    },
    [smartAccount?.provider]
  );

  const getFeeQuotes = useCallback(
    async (tx: Transaction | Transaction[]) => {
      if (!smartAccount) {
        throw new Error('The smart account is not initialized.');
      }
      return smartAccount.getFeeQuotes(tx);
    },
    [smartAccount]
  );

  const buildUserOp = useCallback(
    async ({ tx, feeQuote, tokenPaymasterAddress }: UserOpParams) => {
      if (!smartAccount) {
        throw new Error('The smart account is not initialized.');
      }
      const result = await smartAccount.buildUserOperation({ tx, feeQuote, tokenPaymasterAddress });
      return result;
    },
    [smartAccount]
  );

  const sendUserOp = useCallback(
    async (params: SendTransactionParams, forceHideConfirmModal?: boolean) => {
      if (!smartAccount) {
        throw new Error('The smart account is not initialized.');
      }

      const showConfirmModal = !forceHideConfirmModal && !txConfirm.isNotRemind();

      if (showConfirmModal) {
        if (events.listenerCount(EventName.sendUserOpResult) > 0) {
          throw new Error('Operation failed, there is a transaction being processed');
        }
      }

      let userOpBundle: UserOpBundle | undefined;
      if (
        Object.prototype.hasOwnProperty.call(params, 'userOpHash') &&
        Object.prototype.hasOwnProperty.call(params, 'userOp')
      ) {
        const { userOpHash, userOp } = params as UserOpBundle;
        if (userOpHash && userOp) {
          userOpBundle = { userOpHash, userOp };
        }
      }

      if (!userOpBundle) {
        const { tx, feeQuote, tokenPaymasterAddress } = params as UserOpParams;
        userOpBundle = await buildUserOp({ tx, feeQuote, tokenPaymasterAddress });
      }

      if (!showConfirmModal) {
        return smartAccount.sendUserOperation(userOpBundle);
      }

      return new Promise<string>((resolve, reject) => {
        events.emit(EventName.sendUserOp, userOpBundle);
        events.once(EventName.sendUserOpResult, ({ result, error }) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
      });
    },
    [smartAccount, buildUserOp]
  );

  const publicClient = useMemo(() => {
    if (!smartAccount || !chainId) {
      return undefined;
    }
    return (smartAccount?.provider as any).publicClient as PublicClient;
  }, [smartAccount, chainId]);

  const provider = useMemo(() => {
    const ethereumProvider = new EthereumProvider(
      sendUserOp,
      smartAccount?.provider as any,
      evmAccount
    );
    return ethereumProvider;
  }, [evmAccount, sendUserOp, smartAccount?.provider]);

  return {
    provider,
    evmAccount,
    switchChain,
    chainId,
    getFeeQuotes,
    buildUserOp,
    sendUserOp,
    publicClient
  };
};
