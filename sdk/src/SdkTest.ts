import { ethers } from 'ethers';
import { Sdk } from './Sdk';
import { CONFIG } from './configs';
import { CoinList } from './CoinList';

async function main() {
    const provider = new ethers.JsonRpcProvider(`https://testnet-rpc.merlinchain.io`);
    const sdk = new Sdk(provider, CONFIG.merlinTestnet);
    await sdk.reload();
    // const coinList = new CoinList(provider, CONFIG.merlinTestnet);
    // await coinList.reload();
}
main().then(console.log);
