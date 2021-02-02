import classNames from 'classnames';

export interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  suffix?: string;
}

export default function TextInput({
  label,
  name,
  required = false,
  type = 'text',
  suffix = '',
  className,
  ...other
}: TextInputProps) {
  return (
    <label htmlFor={name} className={classNames('flex flex-1 items-center', className)}>
      {label ? (
        <span className="text-gray-700 w-60">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </span>
      ) : null}
      <input
        type={type}
        name={name}
        id={name}
        className={`ml-${
          label ? 4 : 0
        } block w-full max-w-sm rounded-md border-gray-400 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-50`}
        {...other}
      />
      <label className="ml-2">{suffix}</label>
    </label>
  );
}
