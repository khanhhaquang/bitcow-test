export const TOKEN_KEY = 'token';

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const generateAuthToken = (token: string, address: string, chain: number) => {
  const separator = ',';
  return [token, address, chain].join(separator);
};

export const parseAuthToken = (authToken = '') => {
  const separator = ',';
  const result = authToken?.split(separator);

  return {
    token: result?.[0] || '',
    address: result?.[1] || '',
    chain: Number(result?.[2]) || 0
  };
};

const authTokenManager = () => {
  let token = getLocalStorage(TOKEN_KEY) || '';

  const get = () => {
    return token || getLocalStorage(TOKEN_KEY);
  };

  const set = (v: string) => {
    token = v;
    setLocalStorage(TOKEN_KEY, v);
  };

  const clear = () => {
    token = '';
    removeLocalStorage(TOKEN_KEY);
  };
  return {
    get,
    set,
    clear
  };
};

const authToken = authTokenManager();

export { authToken };
