export class NetworkConfiguration {
  constructor(public name: string, public fullNodeUrl: string, public explorerUrl: string) {}
}

export const LOCAL_CONFIG = new NetworkConfiguration('localhost', 'http://0.0.0.0:8080', '');

export const TESTNET_CONFIG = new NetworkConfiguration(
  'testnet',
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
