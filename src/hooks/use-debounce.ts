/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback } from "react";

type DebouncedFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => Promise<Awaited<ReturnType<T>>>;

const useDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): DebouncedFunction<T> => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      return new Promise((resolve, reject) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    },
    [fn, delay],
  );
};

export { useDebounce };
