import { createAction } from '@reduxjs/toolkit';

const SET_PICKED_CARD = createAction<[]>('lucky/SET_PICKED_CARD');

export default {
  SET_PICKED_CARD
};
