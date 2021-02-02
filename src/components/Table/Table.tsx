import { ReactElement, ReactNode } from 'react';
import { Entity } from 'types';
import classNames from 'classnames';

export type Column<T extends Entity> = {
  key: string;
  name: string;
  render?: (value: T[keyof T], index: number, item: T, all: T[]) => T[keyof T] | string | ReactNode;
};

export interface TableProps<T extends Entity> {
  columns: Column<T>[];
  data: T[];
  onDelete?: (item: T) => void;
  name?: string;
  compact?: boolean;
}

const defaultRender = (value: any) => value;

export default function Table<T extends Entity>({
  columns,
  data,
  onDelete,
  name = 'Data',
  compact = false,
}: TableProps<T>): ReactElement {
  return (
    <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative flex-1">
      <thead>
        <tr className="text-left">
          {columns.map((col, i) => (
            <th
              key={col.key}
              className={classNames(
                'bg-gray-200 sticky top-0 border-b border-gray-300 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs',
                {
                  'pl-tabl': i === 0 && !compact,
                  'pr-tabr': i === columns.length - 1 && !onDelete && !compact,
                },
              )}
            >
              {col.name}
            </th>
          ))}
          {onDelete ? (
            <th
              className={classNames(
                'bg-gray-200 sticky top-0 border-b border-gray-300 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs pr-tabr text-right',
              )}
            />
          ) : null}
        </tr>
      </thead>
      <tbody>
        {data.length ? (
          data.map((item, index) => (
            <tr
              key={item.id}
              className={classNames('hover:bg-gray-100', {
                'bg-gray-50': index % 2 === 0,
              })}
            >
              {columns.map((col, i) => (
                <td
                  key={col.key}
                  className={classNames('border-t border-gray-200', {
                    'border-b': index === data.length - 1,
                  })}
                >
                  <span
                    className={classNames('text-gray-700 px-6 py-3 flex items-center', {
                      'pl-tabl': i === 0 && !compact,
                      'pr-tabr': i === columns.length - 1 && !compact,
                    })}
                  >
                    {(col.render ?? defaultRender)(item[col.key], index, item, data)}
                  </span>
                </td>
              ))}
              {onDelete ? (
                <td
                  className={classNames('border-t border-gray-200 text-right pr-tabr', {
                    'border-b': index === data.length - 1,
                  })}
                >
                  <button
                    className="rounded-md border-red-700 border bg-red-600 text-white px-3 py-1 shadow-sm focus-within:border-red-700 focus:ring focus-within:ring-red-700 focus-within:ring-opacity-50 focus:outline-none disabled:pointer-events-none disabled:opacity-70 inline-flex items-center"
                    onClick={() => onDelete(item)}
                  >
                    Delete
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="ml-3 inline"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              ) : null}
            </tr>
          ))
        ) : (
          <tr className="bg-gray-50 text-center">
            <td
              className="border-t border-b border-gray-200 py-6"
              colSpan={columns.length + (onDelete ? 1 : 0)}
            >
              No {name}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
