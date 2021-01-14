import Term from 'react-console-emulator';

interface Props {
  children?: string;
  terminalClassName?: string;
}

export default function Terminal({ children, terminalClassName, ...props }: Props) {
  return (
    <div className={`bg-black rounded-md`} {...props} key={children}>
      <div className="flex p-2">
        <div className="w-2 h-2 rounded-xl bg-red-500 mr-1" />
        <div className="w-2 h-2 rounded-xl bg-yellow-400 mr-1" />
        <div className="w-2 h-2 rounded-xl bg-green-500 mr-1" />
      </div>
      <Term
        commands={{ echo: { fn: () => null } }}
        welcomeMessage={
          <span>
            <span className="font-bold text-yellow-500">$</span> {children}
          </span>
        }
        readOnly
        style={{ minHeight: 0 }}
        className={terminalClassName}
      />
    </div>
  );
}
