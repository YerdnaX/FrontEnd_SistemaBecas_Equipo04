import { describe, expect, it } from 'vitest';
import { contrasenaEsSegura, correoEsValido, cedulaEsValida } from './validaciones.js';

describe('validaciones de formularios administrativos', () => {
  it('valida el correo institucional antes de crear un usuario', () => {
    expect(correoEsValido('persona@cuc.ac.cr')).toBe(true);
    expect(correoEsValido('correo-invalido')).toBe(false);
  });

  it('exige una contraseña temporal segura', () => {
    expect(contrasenaEsSegura('Temporal9!')).toBe(true);
    expect(contrasenaEsSegura('debil')).toBe(false);
  });
});

describe('cedulaEsValida', () => {
  it('acepta una cédula de 9 dígitos', () => {
    expect(cedulaEsValida('118970123')).toBe(true);
  });

  it('normaliza guiones y espacios antes de validar', () => {
    expect(cedulaEsValida('1-1897-0123')).toBe(true);
    expect(cedulaEsValida(' 118970123 ')).toBe(true);
  });

  it('rechaza cédulas con letras', () => {
    expect(cedulaEsValida('11897012A')).toBe(false);
  });

  it('rechaza cédulas incompletas', () => {
    expect(cedulaEsValida('1189701')).toBe(false);
  });
});

