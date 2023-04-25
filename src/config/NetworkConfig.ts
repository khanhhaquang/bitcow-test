export class NetworkConfiguration {
  constructor(
    public name: string,
    public fullNodeUrl: string,
    public faucetUrl: string,
    public isMainNet = false
  ) {}
}

export const LOCAL_CONFIG = new NetworkConfiguration(
  'localhost',
  'http://0.0.0.0:8080',
  'http://0.0.0.0:8000'
);

export const TESTNET_CONFIG = new NetworkConfiguration(
  'testnet',
  'https://fullnode.testnet.aptoslabs.com/v1',
  'https://faucet.testnet.aptoslabs.com'
);

export const MAINNET_CONFIG = new NetworkConfiguration(
  'mainnet',
  'https://aptos-mainnet.nodereal.io/v1/a082c9e26c0d41bc8edcea7197decf5d',
  ''
);

export const CONFIGS = {
  localhost: LOCAL_CONFIG,
  testnet: TESTNET_CONFIG,
  mainnet: MAINNET_CONFIG
};
