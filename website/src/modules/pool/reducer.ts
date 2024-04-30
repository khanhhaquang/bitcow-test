import { createReducer } from '@reduxjs/toolkit';

// import { sortBy } from 'lodash';
import { RootState } from 'modules/rootReducer';

import { LiquidityModal } from 'types/pool';

import actions from './actions';

import { IPool } from '../../sdk';

interface SwapState {
  isFetching: boolean;
  isFetched: boolean;
  error: any;
  poolList: IPool[];
  // filters: IPoolFilters;
  liquidityModal: LiquidityModal;
}

const initState: SwapState = {
  isFetching: false,
  isFetched: false,
  error: null,
  poolList: [],
  liquidityModal: null
  // filters: {
  //   search: '',
  //   filterBy: '',
  //   sortBy: '',
  //   showSelfLiquidity: false
  // }
};

export default createReducer(initState, (builder) => {
  builder
    .addCase(actions.SET_IS_FETCHING, (state, { payload }) => {
      state.isFetching = payload;
      state.isFetched = false;
    })
    .addCase(actions.TOGGLE_LIQUIDITY_MODAL, (state, { payload }) => {
      state.liquidityModal = payload;
    })
    .addCase(actions.SET_POOL_LIST, (state, { payload }) => {
      state.poolList = payload;
      state.isFetching = false;
      state.isFetched = true;
    });
  // .addCase(actions.SET_FILTERS, (state, { payload }) => {
  //   state.filters = payload;
  // });
});

export const getIsFetchingPoolList = (state: RootState) => state.pool.isFetching;
export const getIsFetchedPoolList = (state: RootState) => state.pool.isFetched;
export const getLiquidityModal = (state: RootState) => state.pool.liquidityModal;
export const getPoolList = (state: RootState) => state.pool.poolList;
