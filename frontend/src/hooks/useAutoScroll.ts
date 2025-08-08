import { useEffect, useRef } from "react";

export function useAutoScroll<T extends HTMLElement>(deps: any[] = []) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
} 