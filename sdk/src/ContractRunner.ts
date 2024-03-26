import { BaseContractMethod, Provider, Signer, ContractMethodArgs } from 'ethers';
import { TxOption } from './types';

export abstract class ContractRunner {
    protected constructor(
        protected provider: Provider,
        protected txOption?: TxOption,
        protected signer?: Signer,
        protected address?: string
    ) {}

    setTxOption(txOption?: TxOption) {
        this.txOption = txOption;
    }

    setSigner(signer?: Signer, address?: string) {
        this.signer = signer;
        this.address = address;
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
        const tx = await this.signer!.sendTransaction(await method.populateTransaction(...args));
        return await tx.wait();
    }

    async getAddress(): Promise<string | undefined> {
        if (this.address) {
            return this.address;
        } else if (this.signer) {
            this.address = await this.signer.getAddress();
            return this.address;
        } else {
            return undefined;
        }
    }
    afterSetSigner(signer?: Signer): void {}
}
