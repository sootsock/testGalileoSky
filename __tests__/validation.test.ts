import { validateField, validateAll } from '@/lib/validation';
import { FormField } from '@/lib/types';

function makeField(partial: Partial<FormField>): FormField {
  return {
    id: 'id',
    name: 'name',
    label: 'Label',
    type: 'string',
    validation: { type: 'string', rules: { required: false } },
    ...partial,
  };
}

describe('validateField', () => {
  test('required string', () => {
    const f = makeField({ type: 'string', validation: { type: 'string', rules: { required: true } } });
    expect(validateField(f, '')).toMatch(/required/);
    expect(validateField(f, 'x')).toBeNull();
  });

  test('min/max length', () => {
    const f = makeField({ type: 'string', validation: { type: 'string', rules: { minLength: 2, maxLength: 3 } } });
    expect(validateField(f, 'a')).toMatch(/>= 2/);
    expect(validateField(f, 'abcd')).toMatch(/<= 3/);
    expect(validateField(f, 'abc')).toBeNull();
  });

  test('integer bounds', () => {
    const f = makeField({ type: 'integer', validation: { type: 'integer', rules: { min: 1, max: 10 } } });
    expect(validateField(f, '0')).toMatch(/>= 1/);
    expect(validateField(f, '11')).toMatch(/<= 10/);
    expect(validateField(f, '5')).toBeNull();
    expect(validateField(f, 'foo')).toMatch(/integer/);
  });

  test('decimal places and range', () => {
    const f = makeField({ type: 'decimal', validation: { type: 'decimal', rules: { min: -1, max: 1, decimalPlaces: 2 } } });
    expect(validateField(f, '1.234')).toMatch(/decimal places/);
    expect(validateField(f, '2')).toMatch(/<= 1/);
    expect(validateField(f, '-2')).toMatch(/>= -1/);
    expect(validateField(f, '0.11')).toBeNull();
  });

  test('datetime min/max', () => {
    const f = makeField({ type: 'datetime', validation: { type: 'datetime', rules: { min: '2020-01-01T00:00', max: '2020-12-31T23:59' } } });
    expect(validateField(f, 'invalid')).toMatch(/datetime/);
    expect(validateField(f, '2019-12-31T23:59')).toMatch(/after/);
    expect(validateField(f, '2021-01-01T00:00')).toMatch(/before/);
    expect(validateField(f, '2020-06-01T12:00')).toBeNull();
  });
});

describe('validateAll', () => {
  test('collects errors', () => {
    const fields: FormField[] = [
      makeField({ id: 'a', label: 'A', type: 'integer', validation: { type: 'integer', rules: { required: true } } }),
      makeField({ id: 'b', label: 'B', type: 'string', validation: { type: 'string', rules: { minLength: 2 } } }),
    ];
    const errors = validateAll(fields, { a: '', b: 'x' });
    expect(errors.a).toBeTruthy();
    expect(errors.b).toBeTruthy();
  });
});


