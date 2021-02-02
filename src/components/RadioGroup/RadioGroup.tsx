import classNames from 'classnames';

export interface RadioGroupProps extends React.HTMLProps<HTMLInputElement> {
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
}

export default function RadioGroup({
  label,
  name,
  options,
  className,
  value,
  ...other
}: RadioGroupProps) {
  return (
    <label className={classNames('flex flex-1 items-center', className)}>
      {label ? <span className="text-gray-700 w-60">{label}</span> : null}
      {options.map((opt) => (
        <label
          key={opt.value}
          className={classNames('flex items-center', {
            'opacity-50': opt.disabled,
            'pointer-events-none': opt.disabled,
          })}
        >
          <input
            type="radio"
            name={name}
            disabled={opt.disabled}
            value={opt.value}
            checked={value !== undefined ? value === opt.value : undefined}
            className={classNames(
              'rounded border-gray-300 text-gray-600 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-400 focus:ring-opacity-50',
              { 'ml-4': label },
            )}
            {...other}
          />
          <span className="ml-3">{opt.label}</span>
        </label>
      ))}
    </label>
  );
}
