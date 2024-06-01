import { createReducer } from '@reduxjs/toolkit';
import { RootState } from 'modules/rootReducer';

import actions from './actions';

interface LuckyCowState {
  pickedCard: [];
}

const initState: LuckyCowState = {
  pickedCard: []
};

export default createReducer(initState, (builder) => {
  builder.addCase(actions.SET_PICKED_CARD, (state, action) => {
    state.pickedCard = action.payload;
  });
});

export const getPickedCard = (state: RootState) => state.luckyCow.pickedCard;
