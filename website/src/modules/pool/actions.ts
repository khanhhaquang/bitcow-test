import { createAction } from '@reduxjs/toolkit';

import { IPoolFilters, LiquidityModal } from 'types/pool';

import { Pool } from '../../sdk';

const SET_IS_FETCHING = createAction<boolean>('pool/SET_IS_FETCHING');
const TOGGLE_LIQUIDITY_MODAL = createAction<LiquidityModal>('pool/TOGGLE_LIQUIDITY_MODAL');
const SET_POOL_LIST = createAction<Pool[]>('pool/SET_POOL_LIST');
const SET_FILTERS = createAction<IPoolFilters>('pool/SET_FILTERS');

export default {
  SET_IS_FETCHING,
  TOGGLE_LIQUIDITY_MODAL,
  SET_POOL_LIST,
  SET_FILTERS
};
