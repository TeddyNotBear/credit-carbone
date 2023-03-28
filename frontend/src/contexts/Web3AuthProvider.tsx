import { SafeEventEmitterProvider, UserInfo } from '@web3auth/base';
import { Web3Auth } from '@web3auth/modal';
import {
  FC,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Balance,
  TickerAddressesMapping,
  TickerInfoMap,
} from '../constants/ticker';
import { DEFAULT_NETWORK, Network, NetworkConfig } from '../constants/web3';
import { RPC } from '../types/rpc/RPC';

interface Web3Config {
  web3auth: Web3Auth | null;
  provider: SafeEventEmitterProvider | null;
  network: Network;
  address: string | null;
  userInfo: any;
  chainId: number | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>; // To be defined
  getAccounts: () => Promise<string>;
  switchNetwork: (network: Network) => Promise<void>;
  sendTransaction: () => Promise<unknown | undefined>;
  signMessage: () => Promise<string | undefined>;
  getPrivateKey: () => Promise<string | undefined>;
}

export const Web3Context = createContext<Web3Config>({
  network: DEFAULT_NETWORK,
  provider: null,
  web3auth: null,
  address: null,
  userInfo: null,
  chainId: null,
  login: async () => {},
  logout: async () => {},
  getUserInfo: async () => {},
  getAccounts: async () => 'hello',
  switchNetwork: async () => {},
  sendTransaction: async () => [],
  signMessage: async () => 'hello',
  getPrivateKey: async () => 'hello',
});

export const Web3Provider: FC<{ children: any }> = ({ children }) => {
  const [network, setNetwork] = useState<Network>(DEFAULT_NETWORK);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null,);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId: import.meta.env.VITE_WEB3_AUTH_CLIENT_ID || '',
          chainConfig: NetworkConfig[network] as any,
        });
        setWeb3auth(web3authInstance);

        await web3authInstance.initModal();
        if (web3authInstance.provider) {
          setProvider(web3authInstance.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [network]);

  const login = useCallback(async () => {
    if (!web3auth) {
      console.error('web3auth not initialized yet');
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  }, [web3auth]);

  const logout = useCallback(async () => {
    if (!web3auth) {
      console.error('web3auth not initialized yet');
      return;
    }
    await web3auth.logout();
    setProvider(null);
  }, [web3auth]);

  const getUserInfo = useCallback(async () => {
    if (!web3auth) {
      console.error('web3auth not initialized yet');
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
    return user;
  }, [web3auth]);

  const switchNetwork = useCallback(async (net: Network) => {
    setNetwork(net);
  }, []);

  const getChainId = useCallback(async () => {
    if (!provider) {
      console.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.getChainId();
    return result;
  }, [provider]);

  const getAccounts = useCallback(async () => {
    if (!provider) {
      console.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.getAccounts();
    return result;
  }, [provider]);

  const sendTransaction = useCallback(async () => {
    if (!provider) {
      console.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    return receipt;
  }, [provider]);

  const signMessage = useCallback(async () => {
    if (!provider) {
      console.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    return signedMessage;
  }, [provider]);

  const getPrivateKey = useCallback(async () => {
    if (!provider) {
      console.error('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    return privateKey;
  }, [provider]);

  useEffect(() => {
    const fetchData = async () => {
      const addressResult = await getAccounts();
      setAddress(addressResult);

      const chainIdResult = await getChainId();
      setChainId(chainIdResult);

      const userInfoResult = await getUserInfo();
      setUserInfo(userInfoResult);
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchData();
  }, [getAccounts, getChainId, getUserInfo]);

  const contextValues = useMemo(() => {
    return {
      network,
      provider,
      web3auth,
      address,
      userInfo,
      chainId,
      login,
      logout,
      switchNetwork,
      sendTransaction,
      getUserInfo,
      getAccounts,
      signMessage,
      getPrivateKey,
    };
  }, [
    network,
    provider,
    web3auth,
    address,
    userInfo,
    chainId,
    login,
    logout,
    switchNetwork,
    sendTransaction,
    getUserInfo,
    getAccounts,
    signMessage,
    getPrivateKey,
  ]);

  return (
    <Web3Context.Provider value={contextValues}>
      {children}
    </Web3Context.Provider>
  );
};