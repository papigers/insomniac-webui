declare module 'react-console-emulator' {
  interface TerminalProps {
    commands: Record<string, { fn: () => void }>;
    welcomeMessage?: React.ReactNode;
    readOnly?: boolean;
    style?: React.CSSProperties;
    className?: string;
  }
  declare const Terminal: React.ComponentClass<TerminalProps>;

  export = Terminal;
}
