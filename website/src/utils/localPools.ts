import { SearchPairMessage, TokenInfo } from '../sdk';

export function getLocalPairMessages(chainId: number): SearchPairMessage[] {
  const str = localStorage.getItem('local-pools-' + chainId);
  if (str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return [];
    }
  }
  return [];
}

export function getLocalTokens(chainId: number) {
  const localPairs = getLocalPairMessages(chainId);
  const localTokens: Record<string, TokenInfo> = {};
  for (const localPair of localPairs) {
    localTokens[localPair.xTokenInfo.address] = localPair.xTokenInfo;
    localTokens[localPair.yTokenInfo.address] = localPair.yTokenInfo;
  }
  return Object.values(localTokens);
}

export function saveLocalPairMessages(chainId: number, searchedPairMessages: SearchPairMessage[]) {
  const oldSearchPairMessages = getLocalPairMessages(chainId);
  if (oldSearchPairMessages.length === 0) {
    localStorage.setItem('local-pools-' + chainId, JSON.stringify(searchedPairMessages));
  }
  const oldPairAddresses = oldSearchPairMessages.map((pool) => pool.pairAddress);
  localStorage.setItem(
    'local-pools-' + chainId,
    JSON.stringify(
      oldSearchPairMessages.concat(
        searchedPairMessages.filter((pair) => !oldPairAddresses.includes(pair.pairAddress))
      )
    )
  );
}
