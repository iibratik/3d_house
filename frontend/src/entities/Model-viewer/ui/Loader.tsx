'use client';

import { Html, useProgress } from '@react-three/drei';

export function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-2">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-600">{Math.round(progress)}% loaded</p>
      </div>
    </Html>
  );
}
