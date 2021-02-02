import classNames from 'classnames';
import InputRange, { InputRangeProps, Range } from 'react-input-range';
import { ChangeEvent, ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import 'react-input-range/lib/css/index.css';
import Checkbox from 'components/Checkbox/Checkbox';

export interface SliderProps extends Omit<InputRangeProps, 'value' | 'onChange' | 'step'> {
  label?: string;
  className?: string;
  required?: boolean;
  value?: number | string;
  onChange?: ChangeEventHandler | ((event: Event) => void);
}

const regex = /(\d+)-{0,1}(\d*)/;

const parseValue = (
  value: string | number | undefined,
  isRange: boolean,
  minValue: number,
  maxValue: number,
) => {
  const match = regex.exec(value ? `${value}` : '');
  return match
    ? !isRange
      ? +match[1]
      : {
          min: +match[1],
          max: +(match[2] || match[1]),
        }
    : !isRange
    ? minValue
    : {
        min: minValue,
        max: maxValue,
      };
};

const parseInitialValue = (
  value: string | number | undefined,
  minValue: number,
  maxValue: number,
): [Range | number | undefined, boolean] => {
  const match = regex.exec(value ? `${value}` : '');
  const isRange = match ? match.length >= 3 : false;
  return [parseValue(value, isRange, minValue, maxValue), isRange];
};

export default function Slider({
  label,
  name,
  required = false,
  className,
  value,
  onChange,
  minValue = 0,
  maxValue = 10,
  allowSameValues = true,
  draggableTrack = true,
  ...other
}: SliderProps) {
  const [initialValue, initialIsRange] = parseInitialValue(value, minValue, maxValue);
  const [isRange, setIsRange] = useState(initialIsRange);
  const [innerValue, setInnerValue] = useState<Range | number | undefined>(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInnerValue(parseValue(value, isRange, minValue, maxValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRange]);

  const stringValue = useMemo(
    () =>
      innerValue !== undefined
        ? !isRange
          ? `${innerValue}`
          : `${(innerValue as Range).min}-${(innerValue as Range).max}`
        : innerValue,
    [innerValue, isRange],
  );

  useEffect(() => {
    const event = new Event('input', { bubbles: true });
    inputRef.current?.dispatchEvent(event);
    (onChange as (event: Event) => void)?.(event);
  }, [onChange, stringValue]);

  return (
    <label htmlFor={name} className={classNames('flex flex-1 items-center', className)}>
      <span className="text-gray-700 w-60 flex-shrink-0">
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </span>
      <div className="ml-4 flex w-full flex-row items-center">
        <div className="flex-1 max-w-sm slider">
          <InputRange
            value={innerValue}
            onChange={setInnerValue}
            allowSameValues={allowSameValues}
            minValue={minValue}
            maxValue={maxValue}
            draggableTrack={draggableTrack}
            {...other}
          />
          <input
            ref={inputRef}
            type="hidden"
            name={name}
            id={name}
            className="ml-4 block w-full max-w-sm rounded-md border-gray-400 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-50"
            value={stringValue}
            onChange={onChange as ChangeEventHandler}
          />
        </div>
        <Checkbox
          className={`ml-4 w-20 flex-shrink flex-grow-0 opacity-${other.disabled ? 50 : 100}`}
          name={`${name}-isRange`}
          label="Range"
          checked={isRange}
          disabled={other.disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setIsRange(e.target.checked)}
          invert
        />
      </div>
    </label>
  );
}
