export const toTruncateStr = (str: string, sliceLength = -200, maxLength = 200): string => {
  if (str.length >= maxLength) {
    return str.slice(sliceLength);
  }
  return str;
};
