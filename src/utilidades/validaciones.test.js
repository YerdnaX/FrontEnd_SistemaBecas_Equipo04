import { describe, expect, it } from 'vitest';
import { contrasenaEsSegura, correoEsValido } from './validaciones.js';

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

