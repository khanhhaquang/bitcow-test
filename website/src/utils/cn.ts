import classNames, { ArgumentArray } from 'classnames';
import { twMerge } from 'tailwind-merge';

export const cn = (...classes: ArgumentArray) => {
  return twMerge(classNames(...classes));
};
