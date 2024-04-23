export const displayAddress = (address = '', startOffset = 4, endOffset = 4): string => {
  if (!address) return '--';

  const lowerAddress = address.toLowerCase();

  return lowerAddress.slice(0, startOffset) + '...' + lowerAddress.slice(-endOffset);
};
