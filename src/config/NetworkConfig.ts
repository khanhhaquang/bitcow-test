export class NetworkConfiguration {
  constructor(public name: string, public fullNodeUrl: string, public explorerUrl: string) {}
}

export const LOCAL_CONFIG = new NetworkConfiguration('localhost', 'http://0.0.0.0:8080', '');

export const TESTNET_CONFIG = new NetworkConfiguration(
  'testnet',
  // 'https://rpc.particle.network/evm-chain?chainId=686868&projectUuid=4fc09dbd-b5a7-4d3a-9610-40200de091d1&projectKey=c7ImwhUKrhSx7d6kpoKbbrHJmzrWhgJGvlU0dbRH',
  'https://testnet-rpc.merlinchain.io',
  'https://scan.merlinchain.io/'
);

export const MAINNET_CONFIG = new NetworkConfiguration(
  'mainnet',
  'https://rpc.merlinchain.io',
  'https://testnet-scan.merlinchain.io/'
);

export const CONFIGS = {
  localhost: LOCAL_CONFIG,
  testnet: TESTNET_CONFIG,
  mainnet: MAINNET_CONFIG
};
