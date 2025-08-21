import { validateSchema, isSchemaValid } from '@/lib/schema';
import { FormSchema } from '@/lib/types';

function baseSchema(): FormSchema {
  return {
    id: 's1',
    title: 'Test',
    version: 1,
    fields: [
      { id: 'f1', name: 'age', label: 'Age', type: 'integer', validation: { type: 'integer', rules: { required: true, min: 0 } } },
    ],
  };
}

describe('schema validation', () => {
  test('valid schema passes', () => {
    const s = baseSchema();
    expect(validateSchema(s).valid).toBe(true);
    expect(isSchemaValid(s)).toBe(true);
  });

  test('invalid field type fails', () => {
    const s: any = baseSchema();
    s.fields[0].type = 'wrong';
    const res = validateSchema(s);
    expect(res.valid).toBe(false);
    expect(res.errors.join(' ')).toMatch(/integer\|decimal\|string\|datetime/);
  });

  test('name uniqueness', () => {
    const s = baseSchema();
    s.fields.push({ id: 'f2', name: 'age', label: 'Age2', type: 'integer', validation: { type: 'integer', rules: {} } });
    const res = validateSchema(s);
    expect(res.valid).toBe(false);
    expect(res.errors.join(' ')).toMatch(/name must be unique/);
  });
});


