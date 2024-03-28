import type {
  Actions,
  AddEthereumChainParameter,
  Provider,
  ProviderConnectInfo,
  ProviderRpcError
} from '@web3-react/types';
import { Connector } from '@web3-react/types';

import type { EIP6963ProviderDetail, EIP6963ProviderInfo } from './types';

import type { WalletMetadata } from '../../connector';
import type { Metadata } from '../../types/types';

export function parseChainId(chainId: string | number) {
  return typeof chainId === 'string' ? Number.parseInt(chainId, 16) : chainId;
}

interface EIP6963ConstructorArgs {
  actions: Actions;
  providerDetail: EIP6963ProviderDetail;
  onError?: (error: Error) => void;
}

export class EIP6963Connector extends Connector implements Metadata {
  /** {@inheritdoc Connector.provider} */
  provider: Provider;

  info: EIP6963ProviderInfo;

  constructor({ actions, providerDetail, onError }: EIP6963ConstructorArgs) {
    super(actions, onError);
    this.info = providerDetail.info;
    this.provider = providerDetail.provider;

    this.provider.on('connect', ({ chainId }: ProviderConnectInfo): void => {
      this.actions.update({ chainId: parseChainId(chainId) });
    });

    this.provider.on('disconnect', (error: ProviderRpcError): void => {
      this.actions.resetState();
      this.onError?.(error);
    });

    this.provider.on('chainChanged', (chainId: string): void => {
      this.actions.update({ chainId: parseChainId(chainId) });
    });

    this.provider.on('accountsChanged', (accounts: string[]): void => {
      this.actions.update({ accounts });
    });
  }

  /** {@inheritdoc Connector.connectEagerly} */
  public async connectEagerly(): Promise<void> {
    const cancelActivation = this.actions.startActivation();

    try {
      if (!this.provider) return cancelActivation();

      // Wallets may resolve eth_chainId and hang on eth_accounts pending user interaction, which may include changing
      // chains; they should be requested serially, with accounts first, so that the chainId can settle.
      const accounts = (await this.provider.request({ method: 'eth_accounts' })) as string[];
      if (!accounts.length) throw new Error('No accounts returned');
      const chainId = (await this.provider.request({ method: 'eth_chainId' })) as string;
      this.actions.update({ chainId: parseChainId(chainId), accounts });
    } catch (error) {
      console.debug('Could not connect eagerly', error);
      // we should be able to use `cancelActivation` here, but on mobile, metamask emits a 'connect'
      // event, meaning that chainId is updated, and cancelActivation doesn't work because an intermediary
      // update has occurred, so we reset state instead
      this.actions.resetState();
    }
  }

  public async activate(
    desiredChainIdOrChainParameters?: number | AddEthereumChainParameter
  ): Promise<void> {
    try {
      // Wallets may resolve eth_chainId and hang on eth_accounts pending user interaction, which may include changing
      // chains; they should be requested serially, with accounts first, so that the chainId can settle.
      const accounts = (await this.provider.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = (await this.provider.request({ method: 'eth_chainId' })) as string;
      const receivedChainId = parseChainId(chainId);
      const desiredChainId =
        typeof desiredChainIdOrChainParameters === 'number'
          ? desiredChainIdOrChainParameters
          : desiredChainIdOrChainParameters?.chainId;

      // if there's no desired chain, or it's equal to the received, update
      if (!desiredChainId || receivedChainId === desiredChainId) {
        return this.actions.update({ chainId: receivedChainId, accounts });
      }
      const desiredChainIdHex = `0x${desiredChainId.toString(16)}`;

      // if we're here, we can try to switch networks
      return await this.provider
        .request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: desiredChainIdHex }]
        })
        .catch((error: ProviderRpcError) => {
          // https://github.com/MetaMask/metamask-mobile/issues/3312#issuecomment-1065923294
          const errorCode = (error.data as any)?.originalError?.code || error.code;

          // 4902 indicates that the chain has not been added to MetaMask and wallet_addEthereumChain needs to be called
          // https://docs.metamask.io/guide/rpc-api.html#wallet-switchethereumchain
          if (errorCode === 4902 && typeof desiredChainIdOrChainParameters !== 'number') {
            if (!this.provider) throw new Error('No provider');
            // if we're here, we can try to add a new network
            return this.provider.request({
              method: 'wallet_addEthereumChain',
              params: [{ ...desiredChainIdOrChainParameters, chainId: desiredChainIdHex }]
            });
          }
          throw error;
        })
        .then(() => this.activate(desiredChainId));
    } catch (error: any) {
      this.onError?.(error);
      throw error;
    }
  }

  get metadata(): WalletMetadata {
    return { id: this.info.rdns, name: this.info.name, icon: this.info.icon, downloadUrl: '' };
  }
}
