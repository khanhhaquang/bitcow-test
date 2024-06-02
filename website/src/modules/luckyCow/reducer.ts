import { createReducer } from '@reduxjs/toolkit';
import { RootState } from 'modules/rootReducer';

import actions from './actions';
import { ILuckyCardInfo } from 'services/luckyDraw';
import { ILuckyAward } from 'pages/LuckyCow/types';

interface LuckyCowState {
  pickedCard: ILuckyCardInfo[];
  luckyAward: ILuckyAward[];
}

const initState: LuckyCowState = {
  pickedCard: [],
  luckyAward: []
};

export default createReducer(initState, (builder) => {
  builder
    .addCase(actions.SET_PICKED_CARD, (state, action) => {
      state.pickedCard = action.payload;
    })
    .addCase(actions.SET_LUCKY_AWARD, (state, action) => {
      state.luckyAward = action.payload;
    })
    .addCase(actions.CLEAR, (state) => {
      state.pickedCard = [];
      state.luckyAward = [];
    });
});

export const getPickedCard = (state: RootState) => state.luckyCow.pickedCard;
export const getLuckyAward = (state: RootState) => state.luckyCow.luckyAward;
