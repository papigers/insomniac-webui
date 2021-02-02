import classNames from 'classnames';

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  invert?: boolean;
}

export default function Checkbox({
  label,
  name,
  className,
  invert = false,
  ...other
}: CheckboxProps) {
  return (
    <label
      htmlFor={name}
      className={classNames(
        'flex flex-1 items-center',
        {
          'flex-row-reverse': invert,
        },
        className,
      )}
    >
      {label ? <span className="text-gray-700 w-60">{label}</span> : null}
      <input
        type="checkbox"
        name={name}
        id={name}
        className={classNames(
          'rounded border-gray-300 text-gray-600 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-400 focus:ring-opacity-50 disabled:opacity-50 disabled:pointer-events-none',
          { 'ml-4': label && !invert, 'mr-4': label && invert },
        )}
        {...other}
      />
    </label>
  );
}
