import { describe, expect, it } from 'vitest';
import { formatearTamanoArchivo, estadoTemporalConvocatoria } from './formato.js';

describe('formatearTamanoArchivo', () => {
  it('formatea bytes a un texto legible en MB', () => {
    expect(formatearTamanoArchivo(2.4 * 1024 * 1024)).toBe('2.4 MB');
  });

  it('formatea bytes a KB cuando el archivo es pequeño', () => {
    expect(formatearTamanoArchivo(512 * 1024)).toBe('512.0 KB');
  });

  it('devuelve "0 B" para un archivo vacío', () => {
    expect(formatearTamanoArchivo(0)).toBe('0 B');
  });

  it('devuelve "—" cuando no hay valor', () => {
    expect(formatearTamanoArchivo(null)).toBe('—');
    expect(formatearTamanoArchivo(undefined)).toBe('—');
  });
});

describe('estadoTemporalConvocatoria', () => {
  it('marca una convocatoria como próxima antes de la apertura', () => {
    const ahora = new Date('2026-06-01T00:00:00Z');
    expect(estadoTemporalConvocatoria('2026-07-01T00:00:00Z', '2026-07-31T00:00:00Z', ahora)).toBe('PROXIMA');
  });

  it('marca una convocatoria como abierta dentro del rango', () => {
    const ahora = new Date('2026-07-15T00:00:00Z');
    expect(estadoTemporalConvocatoria('2026-07-01T00:00:00Z', '2026-07-31T00:00:00Z', ahora)).toBe('ABIERTA');
  });

  it('marca una convocatoria como cerrada después del cierre', () => {
    const ahora = new Date('2026-08-01T00:00:01Z');
    expect(estadoTemporalConvocatoria('2026-07-01T00:00:00Z', '2026-07-31T00:00:00Z', ahora)).toBe('CERRADA');
  });
});
