import { BaseContractMethod, Provider, Signer, ContractMethodArgs } from 'ethers';

import { TxOption } from './types';

export abstract class ContractRunner {
  protected constructor(
    protected provider: Provider,
    protected txOption?: TxOption,
    public signer?: Signer,
    public address?: string
  ) {}

  setTxOption(txOption?: TxOption) {
    this.txOption = txOption;
  }

  setSigner(signer?: Signer, address?: string) {
    if (signer && !address) {
      throw new Error('Must set address while set signer');
    }

    this.signer = signer;
    if (signer) {
      this.address = address;
    } else {
      this.address = undefined;
    }
    this.afterSetSigner(signer);
  }

  requireSigner() {
    if (!this.signer) {
      throw new Error('No Signer');
    }
  }

  async send<A extends Array<any> = Array<any>>(
    method: BaseContractMethod<any[], any, any>,
    ...args: ContractMethodArgs<A>
  ) {
    this.requireSigner();
    const option = args[args.length - 1];
    if (option.gasPrice === undefined) {
      const feeData = await this.provider.getFeeData();
      args[args.length - 1] = { ...option, gasPrice: feeData.gasPrice?.toString() };
    }
    console.log(`Call ${method.name} with args ${JSON.stringify(args)}`);
    const tx = await this.signer!.sendTransaction(await method.populateTransaction(...args));
    return tx.wait();
  }

  getAddress(): string | undefined {
    return this.address;
  }

  afterSetSigner(_signer?: Signer): void {}
}
