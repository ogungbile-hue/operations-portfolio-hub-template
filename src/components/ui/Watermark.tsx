import React from 'react';

interface WatermarkProps {
  text?: string;
}

export function Watermark({ text = "PO" }: WatermarkProps) {
  return (
    <div className="watermark" aria-hidden="true">
      {text}
    </div>
  );
}
