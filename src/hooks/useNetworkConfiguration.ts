import { CONFIGS, NetworkConfiguration } from 'config/NetworkConfig';

let merlinRPC = '';

const useNetworkConfiguration = () => {
  const currentNetworkEnv = process.env.REACT_APP_CURRENT_NETWORK;
  // const rpcEndpoint = useRPCURL();

  let network: NetworkConfiguration;
  if (currentNetworkEnv === 'localhost') {
    network = CONFIGS.localhost;
  } else if (currentNetworkEnv === 'testnet') {
    network = CONFIGS.testnet;
  } else if (currentNetworkEnv === 'mainnet') {
    network = CONFIGS.mainnet;
  } else {
    throw new Error('Invalid network env');
  }
  if (!merlinRPC) merlinRPC = network.fullNodeUrl;
  // if (rpcEndpoint) {
  //   network.fullNodeUrl = rpcEndpoint;
  // } else {
  // }
  network.fullNodeUrl = merlinRPC;

  return { networkCfg: network };
};

export default useNetworkConfiguration;
