import { CheckboxProps } from 'components/Checkbox/Checkbox';
import Slider, { SliderProps } from 'components/Slider/Slider';
import { useState, useEffect, ChangeEvent, FormEvent, ReactNode } from 'react';
import { NumberOrRangeParameter } from 'types';
import TextInput, { TextInputProps } from '../TextInput/TextInput';
import classNames from 'classnames';

export enum ParameterType {
  TEXT = 'text',
  NUMBER = 'number',
  CHECKBOX = 'checkbox',
  RANGE = 'range',
  CUSTOM = 'custom',
}

export type ParameterDefinition = {
  name: string;
  label: string;
  description?: string;
  type: ParameterType;
  placeholder?: string;
  suffix?: string;
};

export type ParamValue = string | boolean | number | undefined;

interface ParameterInputProps<V> {
  onChange?: (name: string, value: V | undefined) => void;
  value?: V;
}

type TextParameterProps = { type: ParameterType.TEXT } & Omit<
  TextInputProps,
  'onChange' | 'value' | 'step' | keyof ParameterDefinition
> &
  ParameterInputProps<string>;

type NumberParameterProps = { type: ParameterType.NUMBER } & Omit<
  TextInputProps,
  'onChange' | 'value' | keyof ParameterDefinition
> &
  ParameterInputProps<number>;

type CheckboxParameterProps = { type: ParameterType.CHECKBOX } & Omit<
  CheckboxProps,
  'onChange' | 'value' | keyof ParameterDefinition
> &
  ParameterInputProps<boolean>;

type RangeParameterProps = { type: ParameterType.RANGE } & Omit<
  SliderProps,
  'onChange' | 'value' | keyof ParameterDefinition
> &
  ParameterInputProps<NumberOrRangeParameter>;

type CustomParameterProps = { type: ParameterType.CUSTOM } & ParameterInputProps<any> & {
    children: (value: any, onChange: (value: any) => void, disabled: boolean) => ReactNode;
    className?: string;
    inline?: boolean;
  };

type ParameterProps = ParameterDefinition &
  (
    | ({ type: ParameterType.TEXT } & TextParameterProps)
    | ({ type: ParameterType.NUMBER } & NumberParameterProps)
    | ({ type: ParameterType.CHECKBOX } & CheckboxParameterProps)
    | ({ type: ParameterType.RANGE } & RangeParameterProps)
    | ({ type: ParameterType.CUSTOM } & CustomParameterProps)
  );

export default function Parameter({
  name,
  label,
  type,
  onChange,
  value,
  ...other
}: ParameterProps) {
  const [enabled, setEnabled] = useState(!!value);
  const [val, setVal] = useState(value);
  const enabledName = type === 'checkbox' ? name : `${name}_enabled`;

  useEffect(() => {
    if (type === ParameterType.CHECKBOX) {
      onChange?.(name, enabled);
    } else {
      onChange?.(name, enabled ? val : undefined);
    }
  }, [enabled, val, name]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="-ml-9 flex items-center py-4">
        <input
          type="checkbox"
          name={enabledName}
          id={enabledName}
          checked={enabled}
          onChange={(e: ChangeEvent) => setEnabled((e.target as HTMLInputElement).checked)}
          className="rounded border-gray-300 text-gray-600 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-400 focus:ring-opacity-50"
        />
        <div
          className={classNames('flex-1 ml-5 flex items-center', {
            'h-9': type !== ParameterType.CUSTOM,
          })}
        >
          {type === ParameterType.CHECKBOX && (
            <label className="text-gray-700" htmlFor={name}>
              {label}
            </label>
          )}
          {(type === ParameterType.TEXT || type === ParameterType.NUMBER) && (
            <TextInput
              type={type}
              label={label}
              name={name}
              required={enabled}
              disabled={!enabled}
              onChange={(e: FormEvent<HTMLInputElement>) =>
                setVal((e.target as HTMLInputElement).value)
              }
              value={val as Exclude<ParamValue, boolean>}
              {...other}
            />
          )}
          {type === ParameterType.RANGE && (
            <Slider
              label={label}
              name={name}
              required={enabled}
              disabled={!enabled}
              onChange={(e: ChangeEvent | Event) => setVal((e.target as HTMLInputElement).value)}
              value={val}
              {...other}
            />
          )}
          {type === ParameterType.CUSTOM && (
            <div
              className={classNames('w-full', {
                flex: (other as CustomParameterProps).inline,
                'items-center': (other as CustomParameterProps).inline,
              })}
            >
              <label
                className={classNames('text-gray-700', {
                  'w-60': (other as CustomParameterProps).inline,
                  'mr-4': (other as CustomParameterProps).inline,
                })}
                htmlFor={name}
              >
                {label}
              </label>
              {(other as CustomParameterProps).children(
                enabled ? val : undefined,
                setVal,
                !enabled,
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
