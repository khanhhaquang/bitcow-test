import { createAction } from '@reduxjs/toolkit';
import { ILuckyAward } from 'pages/LuckyCow/types';
import { ILuckyCardInfo } from 'services/luckyDraw';

const SET_PICKED_CARD = createAction<ILuckyCardInfo[]>('lucky/SET_PICKED_CARD');
const SET_LUCKY_AWARD = createAction<ILuckyAward[]>('lucky/SET_LUCKY_AWARD');
const CLEAR = createAction('lucky/CLEAR');

export default {
  SET_PICKED_CARD,
  SET_LUCKY_AWARD,
  CLEAR
};
