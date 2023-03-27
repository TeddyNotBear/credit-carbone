import { Network } from './web3';

export enum Ticker {
  MATIC = 'MATIC',
  WETH = 'WETH',
}

export interface TickerInfo {
  address: string;
  ticker: Ticker;
  tickerName: string;
  logoURL: string;
}

export interface Balance extends TickerInfo {
  balance: number;
}

export type TickerInfoMap = Record<Ticker, TickerInfo>;
export type TickerInfoMapByNetwork = Record<Network, TickerInfoMap>;

export const POLYGON_MAINNET_TICKER_INFO: TickerInfoMap = {
  [Ticker.MATIC]: {
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    ticker: Ticker.MATIC,
    tickerName: 'Matic',
    logoURL:
      'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
  },
  [Ticker.WETH]: {
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    ticker: Ticker.WETH,
    tickerName: 'Wrapped Ether',
    logoURL:
      'https://raw.githubusercontent.com/dappradar/tokens/main/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/logo.png',
  },
};

const POLYGON_TESTNET_TICKER_INFO: TickerInfoMap = {
  [Ticker.MATIC]: {
    address: '0x0000000000000000000000000000000000001010',
    ticker: Ticker.MATIC,
    tickerName: 'Matic',
    logoURL:
      'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
  },
  [Ticker.WETH]: {
    address: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    ticker: Ticker.WETH,
    tickerName: 'Wrapped Ether',
    logoURL:
      'https://raw.githubusercontent.com/dappradar/tokens/main/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/logo.png',
  },
};

export const TickerAddressesMapping: TickerInfoMapByNetwork = {
  [Network.POLYGON_MAINNET]: POLYGON_MAINNET_TICKER_INFO,
  [Network.POLYGON_TESTNET]: POLYGON_TESTNET_TICKER_INFO,
};
