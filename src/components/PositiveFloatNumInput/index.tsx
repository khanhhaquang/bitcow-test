import classNames from 'classnames';
import { forwardRef, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import invariant from 'tiny-invariant';

import { Theme } from 'contexts/GlobalSettingProvider';
import useGlobalSetting from 'hooks/useGlobalSetting';

import { avoidScientificNotation, cutDecimals, numToGrouped } from './numberFormats';

type PositiveFloatNumInputProps = {
  inputAmount?: number;
  className?: string;
  isDisabled?: boolean;
  placeholder?: string;
  styles?: Object;
  min?: number;
  max?: number;
  isConfine?: boolean;
  maxDecimals?: number;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => {};
  onAmountChange?: (a: number) => void;
  suffix?: string;
  suffixClassname?: string;
};

const MIN_DEFAULT = 0;
const MAX_DEFAULT = Number.MAX_SAFE_INTEGER;
const MAX_DECIMALS_DEFAULT = 9;

// eslint-disable-next-line react/display-name
const PositiveFloatNumInput = forwardRef<
  HTMLInputElement,
  PositiveFloatNumInputProps & { ref: React.Ref<HTMLButtonElement> }
>(
  (
    {
      inputAmount,
      isDisabled = false,
      placeholder = '0',
      className = '',
      styles = {},
      min = MIN_DEFAULT,
      max = MAX_DEFAULT,
      isConfine = false,
      maxDecimals = MAX_DECIMALS_DEFAULT,
      onInputChange = () => {},
      onEnter = () => {},
      onAmountChange = () => {},
      suffix,
      suffixClassname
    },
    ref
  ) => {
    const { theme } = useGlobalSetting();
    invariant(min >= MIN_DEFAULT, 'Min prop value invalid');
    invariant(max <= MAX_DEFAULT, 'Max prop value invalid');
    invariant(
      maxDecimals <= MAX_DECIMALS_DEFAULT && maxDecimals % 1 === 0,
      'Max decimals prop value invalid'
    );
    const canvasRef = useRef<HTMLCanvasElement>();
    const suffixRef = useRef<HTMLSpanElement>();

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
      if (event.key === 'Enter') {
        onEnter();
      }
    };
    const inputToInternalAmount = useMemo(() => {
      if (!inputAmount) return '';
      let inputAmountTemp = inputAmount;
      if (inputAmount > max || inputAmount < min) {
        if (!isConfine) {
          throw new Error('Invalid input amount');
        } else {
          inputAmountTemp = inputAmount > max ? max : min;
        }
      }

      return cutDecimals(avoidScientificNotation(inputAmountTemp), maxDecimals);
    }, [inputAmount, isConfine, max, maxDecimals, min]);

    const [internalAmountText, setInternalAmountText] = useState<string>(inputToInternalAmount); // can be ''

    useEffect(() => {
      // Input only changes internal state when there will be an value update for the zero input cases like 0.0000, 1.0000
      if (inputAmount !== parseFloat(internalAmountText)) {
        setInternalAmountText(inputToInternalAmount);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputAmount]);

    const displayText = numToGrouped(internalAmountText);

    const getTextWidth = useCallback((text, font) => {
      // re-use canvas object for better performance
      const canvas = canvasRef.current ? canvasRef.current : document.createElement('canvas');
      canvasRef.current = canvas;
      const context = canvas.getContext('2d');
      context.font = font;
      const metrics = context.measureText(text);
      return metrics.width;
    }, []);

    const updateSuffix = useCallback(() => {
      const width = displayText ? getTextWidth(displayText, '30px Rany') : '54';
      if (suffixRef.current) {
        suffixRef.current.style.left = width + 'px';
        if (displayText) {
          suffixRef.current.style.color = theme === Theme.Dark ? '#fff' : '#041219';
        } else {
          suffixRef.current.style.color =
            theme === Theme.Dark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(4, 18, 25, 0.3)';
        }
      }
    }, [displayText, getTextWidth, theme]);

    useEffect(() => {
      if (suffix) {
        updateSuffix();
      }
    }, [displayText, suffix, updateSuffix]);

    return (
      <Fragment>
        <input
          ref={ref}
          className={classNames(
            'positiveFloatNumInput',
            'focus: min-w-0 px-1 outline-none',
            { 'cursor-not-allowed': isDisabled },
            className
          )}
          value={displayText}
          placeholder={placeholder}
          inputMode="decimal"
          type="text"
          min={min}
          max={max}
          disabled={isDisabled}
          style={styles}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            if (!/^[0-9,]*[.]?[0-9]*$/.test(event.target.value)) {
              return;
            }
            // Remove group separator
            let valueStr = event.target.value
              .split('')
              .filter((l) => l !== ',')
              .join('');
            // Avoid the case to parse strings like '.123'
            if (/^\./.test(valueStr)) valueStr = '0' + valueStr;

            if (valueStr !== '') {
              const decimalsLength = valueStr.split('.')[1]?.length || 0;
              if (maxDecimals !== undefined && decimalsLength > maxDecimals) {
                return;
              }
              const value = parseFloat(valueStr);
              if (value < min) {
                if (isConfine) valueStr = '0';
                else return;
              } else if (value > max) {
                if (isConfine) valueStr = '' + max;
                else return;
              }
            }
            setInternalAmountText(valueStr);
            onInputChange(event);
            // When internal value is '', convert to 0
            onAmountChange(parseFloat(valueStr || '0'));
          }}
        />
        {suffix && (
          <span className={suffixClassname} ref={suffixRef}>
            {suffix}
          </span>
        )}
      </Fragment>
    );
  }
);

export default PositiveFloatNumInput;
