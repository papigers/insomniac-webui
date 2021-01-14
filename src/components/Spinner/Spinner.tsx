interface Props {
  size?: number;
  trackSize?: number;
  color?: string;
  trackColor?: string;
}

export default function Spinner({
  size = 20,
  trackSize = Math.max(size / 2, 8),
  trackColor = 'gray-200',
  color = 'red-500',
}: Props) {
  return (
    <div
      style={{ borderWidth: trackSize }}
      className={`animate-spin rounded-full border border-${trackColor} border-t-${color} h-${size} w-${size}`}
    />
  );
}
