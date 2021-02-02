import React, { ReactElement } from 'react';

interface Props {
  value: boolean;
}

export default function Bool({ value }: Props): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      stroke="currentColor"
    >
      {value ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ) : (
        <circle
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          cx={12}
          cy={12}
          r={9}
        />
      )}
    </svg>
  );
}
