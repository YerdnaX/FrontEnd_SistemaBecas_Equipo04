import { describe, expect, it } from 'vitest';
import { rutaPrincipalPorRol } from './rutasPorRol.js';

describe('rutaPrincipalPorRol', () => {
  it('envia Registro Academico a su bandeja', () => {
    expect(rutaPrincipalPorRol(['REGISTRO_ACADEMICO'])).toBe('/registro-academico');
  });

  it('envia Finanzas a su bandeja', () => {
    expect(rutaPrincipalPorRol(['FINANZAS'])).toBe('/finanzas');
  });

  it('prioriza el panel del becado sobre el panel de aspirante', () => {
    expect(rutaPrincipalPorRol(['ASPIRANTE', 'BECADO'])).toBe('/becado');
  });
});
