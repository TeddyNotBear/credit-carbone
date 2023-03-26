export enum Network {
  POLYGON_MAINNET = 'polygon-mainnet',
  POLYGON_TESTNET = 'polygon-testnet',
}

export type Config = {
  chainNamespace: string;
  chainId: string;
  rpcTarget: string;
  displayName: string;
  blockExplorerUrl: string;
  ticker: string;
  tickerName: string;
};

export const NetworkConfig: Record<Network, Config> = {
  [Network.POLYGON_MAINNET]: {
    chainNamespace: 'eip155',
    chainId: '0x89',
    rpcTarget: 'https://polygon-rpc.com',
    displayName: 'Polygon Mainnet',
    blockExplorerUrl: 'https://explorer.matic.network/',
    ticker: 'MATIC',
    tickerName: 'Matic',
  },
  [Network.POLYGON_TESTNET]: {
    chainNamespace: 'eip155',
    chainId: '0x13881',
    rpcTarget: 'https://rpc-mumbai.maticvigil.com',
    displayName: 'Polygon Testnet',
    blockExplorerUrl: 'https://mumbai.polygonscan.com/',
    ticker: 'MATIC',
    tickerName: 'Matic',
  },
};

export const DEFAULT_NETWORK = Network.POLYGON_TESTNET;
