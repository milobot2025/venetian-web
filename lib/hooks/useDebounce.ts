import { useState, useEffect } from 'react';

/**
 * Hook personalizado para debouncing de valores
 * @param value - El valor a debouncear
 * @param delay - Retraso en milisegundos
 * @returns El valor debounceado
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurar un timeout para actualizar el valor debounceado
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor o el delay cambian
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
