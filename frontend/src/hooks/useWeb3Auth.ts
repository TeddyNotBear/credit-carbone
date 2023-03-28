import { useContext } from 'react';

import { Web3Context } from '../contexts/Web3AuthProvider';

export const useWeb3Auth = () => {
  const {
    web3auth,
    provider,
    network,
    address,
    userInfo,
    chainId,
    login,
    logout,
    sendTransaction,
    getUserInfo,
    getAccounts,
    signMessage,
    getPrivateKey,
  } = useContext(Web3Context);
  return {
    web3auth,
    provider,
    network,
    address,
    userInfo,
    chainId,
    login,
    logout,
    sendTransaction,
    getUserInfo,
    getAccounts,
    signMessage,
    getPrivateKey,
  };
};