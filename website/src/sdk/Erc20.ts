import { ContractRunner } from './ContractRunner';
import { Contract, Provider, Signer } from 'ethers';

import { TxOption } from './types';

import { ABI_ERC20 } from './abi/ERC20';
import { multUiAmount } from './utils/common';

export class Erc20 extends ContractRunner {
  private contract: Contract;

  constructor(
    provider: Provider,
    public contractAddress: string,
    txOption?: TxOption,
    signer?: Signer
  ) {
    super(provider, txOption, signer);
    this.contract = new Contract(contractAddress, ABI_ERC20, provider);
  }

  async increaseAllowance(owner: string, value: number) {
    return this.send(this.contract.increaseAllowance, owner, multUiAmount(value, 18), {});
  }

  async allowance(owner: string, to: string) {
    const result = await this.contract.allowance(owner, to);
    return result;
  }

  async balanceOf(owner: string) {
    const result = await this.contract.balanceOf(owner);
    return result;
  }
}
