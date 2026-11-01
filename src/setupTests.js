import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

function crearLocalStorage() {
  const datos = new Map();

  return {
    getItem: vi.fn((clave) =>
      datos.has(String(clave)) ? datos.get(String(clave)) : null
    ),
    setItem: vi.fn((clave, valor) => {
      datos.set(String(clave), String(valor));
    }),
    removeItem: vi.fn((clave) => {
      datos.delete(String(clave));
    }),
    clear: vi.fn(() => {
      datos.clear();
    }),
    key: vi.fn((indice) => Array.from(datos.keys())[indice] ?? null),
    get length() {
      return datos.size;
    },
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', crearLocalStorage());
});

afterEach(() => {
  cleanup();
});