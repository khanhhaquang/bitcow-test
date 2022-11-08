// import { getTokenList } from 'modules/swap/reducer';
// import { useSelector } from 'react-redux';
import { IPoolToken } from 'types/pool';
import useAptosWallet from './useAptosWallet';

const useToken = () => {
  // const tokenList = useSelector(getTokenList);
  const { tokenList } = useAptosWallet();

  const retreiveTokenImg = (tokens: IPoolToken[]) => {
    return tokens.map((token) => {
      const existToken = tokenList?.find((t) => t.symbol === token.symbol);
      return existToken?.logo_url;
    });
  };

  return { retreiveTokenImg };
};

export default useToken;
