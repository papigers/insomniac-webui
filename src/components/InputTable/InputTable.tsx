import React, {
  ChangeEvent,
  Dispatch,
  ReactElement,
  SyntheticEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import Table, { Column, TableProps } from 'components/Table/Table';
import { Entity } from 'types';
import TextInput, { TextInputProps } from 'components/TextInput/TextInput';
import classNames from 'classnames';
import Select, { SelectProps } from 'components/Select/Select';
import { CheckboxProps } from 'components/Checkbox/Checkbox';

type Input<T> = {
  key: keyof T;
  name: string;
  type: 'string' | 'number' | 'checkbox' | 'select';
} & (
  | {
      type: 'string' | 'number';
      default?: string | number;
      props?: (item: T) => Omit<TextInputProps, 'value' | 'onChange'>;
    }
  | {
      type: 'checkbox';
      default?: boolean;
      props?: (item: T) => Omit<CheckboxProps, 'value' | 'onChange'>;
    }
  | {
      type: 'select';
      default: string;
      props: (item: T) => Omit<SelectProps, 'value' | 'onChange'>;
    }
);

interface Props<T extends Omit<Entity, 'id'>>
  extends Omit<TableProps<T & Entity>, 'data' | 'columns' | 'onDelete'> {
  value: T[];
  onChange: Dispatch<T[]>;
  inputs: Input<T>[];
  disabled?: boolean;
  orderable?: boolean;
}

function getInputDefaults<T>(input: Input<T>) {
  if (input.default) {
    return input.default;
  }
  switch (input.type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'checkbox':
      return false;
    case 'select':
      return input.default;
    default:
      return '';
  }
}

export default function InputTable<T extends object>({
  value,
  inputs,
  disabled = false,
  onChange,
  orderable = false,
  ...other
}: Props<T>): ReactElement {
  const defaultNewEntryRef = useRef(
    inputs.reduce((all: Partial<T>, input) => {
      const def = getInputDefaults(input);
      if (def) {
        return {
          ...all,
          [input.key]: def,
        };
      }
      return all;
    }, {}),
  );
  const [newEntry, setNewEntry] = useState<Partial<T>>({ ...defaultNewEntryRef.current });

  const onMoveUp = useCallback(
    (index: number, e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (index > 0) {
        onChange([
          ...value.slice(0, index - 1),
          value[index],
          value[index - 1],
          ...value.slice(index + 1),
        ]);
      }
    },
    [value, onChange],
  );
  const onMoveDown = useCallback(
    (index: number, e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (index < value.length) {
        onChange([
          ...value.slice(0, index),
          value[index + 1],
          value[index],
          ...value.slice(index + 2),
        ]);
      }
    },
    [value, onChange],
  );

  const onAdd = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange([...value, newEntry as T]);
      setNewEntry({ ...defaultNewEntryRef.current });
    },
    [newEntry, onChange, value],
  );

  const onDelete = useCallback(
    (index, e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange([...value.slice(0, index), ...value.slice(index + 1)]);
    },
    [onChange, value],
  );

  const onEdit = useCallback(
    (index, payload: T) => {
      onChange([...value.slice(0, index), payload, ...value.slice(index + 1)]);
    },
    [onChange, value],
  );

  type E = T & Entity;
  const tableData: E[] = useMemo(
    () => [
      ...value.map((val, idx) => ({
        ...val,
        id: `${idx + 1}`,
      })),
      {
        id: 'new',
        ...(inputs.reduce(
          (all, curr) => ({
            ...all,
            [curr.key]: getInputDefaults(curr),
          }),
          {},
        ) as T),
        ...newEntry,
      },
    ],
    [value, inputs, newEntry],
  );

  const renderInput = useCallback((item: T, input: Input<T>, onChange: (value: any) => void) => {
    const value = item[input.key] as any;
    const props = input?.props?.(item) ?? {};
    switch (input.type) {
      case 'string':
      case 'number':
        return (
          <TextInput
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            type={input.type === 'string' ? 'text' : 'number'}
            {...(props as TextInputProps)}
          />
        );
      case 'checkbox':
        return null;
      case 'select':
        return (
          <Select
            value={value}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              onChange(e.target.value);
            }}
            {...(props as SelectProps)}
          />
        );
      default:
        return null;
    }
  }, []);

  const columns: Column<E>[] = useMemo(
    () => [
      {
        key: 'id',
        name: '#',
        render: (value: E[keyof E]) => (value === 'new' ? '' : value),
      },
      ...inputs.map((input) => ({
        key: `${input.key}`,
        name: input.name,
        render: (value: T[keyof T], index: number, item: E) =>
          renderInput(item, input, (val) =>
            item.id === 'new'
              ? setNewEntry((entry) => ({
                  ...entry,
                  [input.key]: val,
                }))
              : onEdit(index, { ...item, [input.key]: val }),
          ),
      })),
      {
        key: 'action',
        name: '',
        render: (value: any, index: number, item: E, all: E[]) => (
          <div className={classNames('flex text-right w-full items-center space-x-2 justify-end')}>
            {item.id === 'new' ? (
              <button
                className="rounded-md border-blue-700 border bg-blue-600 text-white px-2 py-1 shadow-sm focus-within:border-blue-700 focus:ring focus-within:ring-blue-700 focus-within:ring-opacity-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 inline-flex items-center text-xs"
                disabled={
                  disabled ||
                  !inputs
                    .map((input) => item[input.key])
                    .every((field) => field !== '' && field !== undefined && field !== null)
                }
                onClick={onAdd}
              >
                Add
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  className="inline ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            ) : (
              <>
                {orderable ? (
                  <>
                    <button
                      className="rounded-md border-gray-700 border bg-gray-600 text-white px-1 py-1 shadow-sm focus-within:border-gray-700 focus:ring focus-within:ring-gray-700 focus-within:ring-opacity-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 inline-flex items-center text-xs"
                      disabled={disabled || index === all.length - 2}
                      onClick={onMoveDown.bind(null, index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        width="16"
                        height="16"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <button
                      className="rounded-md border-gray-700 border bg-gray-600 text-white px-1 py-1 shadow-sm focus-within:border-gray-700 focus:ring focus-within:ring-gray-700 focus-within:ring-opacity-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 inline-flex items-center text-xs"
                      disabled={disabled || index === 0}
                      onClick={onMoveUp.bind(null, index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width="16"
                        height="16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </>
                ) : null}
                <button
                  className="rounded-md border-red-700 border bg-red-600 text-white px-2 py-1 shadow-sm focus-within:border-red-700 focus:ring focus-within:ring-red-700 focus-within:ring-opacity-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 inline-flex items-center text-xs"
                  disabled={disabled}
                  onClick={onDelete.bind(null, index)}
                >
                  Delete
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="ml-1 inline"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [disabled, inputs, onAdd, onDelete, onEdit, onMoveDown, onMoveUp, orderable, renderInput],
  );
  return (
    <div
      className={classNames(
        'w-full mt-4 rounded-lg overflow-hidden border-gray-200 border shadow-sm',
        {
          'pointer-events-none': disabled,
          'opacity-50': disabled,
        },
      )}
    >
      <Table columns={columns} data={tableData} compact {...other} />
    </div>
  );
}
