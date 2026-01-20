
import { useState, useEffect, useRef } from 'react';

export const useContainerWidth = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      setContainerWidth(el.clientWidth || 0);
    });

    ro.observe(el);
    setContainerWidth(el.clientWidth || 0);

    return () => ro.disconnect();
  }, []);

  return { containerRef, containerWidth };
};
