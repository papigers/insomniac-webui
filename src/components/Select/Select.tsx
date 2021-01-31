import classNames from 'classnames';

type Option = {
  value: string;
  label: string;
};

export interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
  options: Option[];
}

export default function Select({
  label,
  name,
  options,
  required = false,
  className,
  ...other
}: SelectProps) {
  return (
    <label htmlFor={name} className={classNames('flex flex-1 items-center', className)}>
      <span className="text-gray-700 w-60">
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </span>
      <select
        name={name}
        id={name}
        className="ml-4 block w-full max-w-sm rounded-md border-gray-400 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-50"
        {...other}
      >
        {options.map((opt) => (
          <option value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
