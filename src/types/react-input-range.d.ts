declare module 'react-input-range' {
  export type InputRangeClassNames = {
    activeTrack: string;
    disabledInputRange: string;
    inputRange: string;
    labelContainer: string;
    maxLabel: string;
    minLabel: string;
    slider: string;
    sliderContainer: string;
    track: string;
    valueLabel: string;
  };
  export type Range = {
    max: number;
    min: number;
  };
  export interface InputRangeProps {
    allowSameValues?: boolean;
    ariaLabelledby?: string;
    ariaControls?: string;
    classNames?: InputRangeClassNames;
    disabled?: boolean;
    draggableTrack?: boolean;
    formatLabel?: (value: number | Range, type: string) => string;
    maxValue?: number;
    minValue?: number;
    name?: string;
    onChange?: (value: number | Range) => void;
    onChangeStart?: (value: number | Range) => void;
    onChangeComplete?: (value: number | Range) => void;
    step?: number;
    value?: number | Range;
  }
  declare const InputRange: React.ComponentClass<InputRangeProps>;

  export default InputRange;
}
