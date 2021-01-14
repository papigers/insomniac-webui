import { ParameterDefinition } from 'components/ParameterForm/parameters';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import TextInput, { TextInputProps } from '../TextInput/TextInput';

export type ParamValue = string | boolean | number | undefined;
interface Props
  extends ParameterDefinition,
    Omit<TextInputProps, 'onChange' | 'value' | keyof ParameterDefinition> {
  onChange?: (name: string, value: ParamValue) => void;
  value?: ParamValue;
}

export default function Parameter({ name, label, type, onChange, value, ...other }: Props) {
  const [enabled, setEnabled] = useState(!!value);
  const [val, setVal] = useState(value);

  const enabledName = type === 'checkbox' ? name : `${name}_enabled`;

  useEffect(() => {
    if (type === 'checkbox') {
      onChange?.(name, enabled);
    } else {
      onChange?.(name, enabled ? val : undefined);
    }
  }, [enabled, val, name]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center py-4">
      <input
        type="checkbox"
        name={enabledName}
        id={enabledName}
        checked={enabled}
        onChange={(e: ChangeEvent) => setEnabled((e.target as HTMLInputElement).checked)}
        className="rounded border-gray-300 text-gray-600 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-400 focus:ring-opacity-50"
      />
      <div className="flex-1 ml-5 h-9 flex items-center">
        {type === 'checkbox' && (
          <label className="text-gray-700" htmlFor={name}>
            {label}
          </label>
        )}
        {(type === 'text' || type === 'number') && (
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
      </div>
    </div>
  );
}
