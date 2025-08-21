import { loadSchema, saveSchema } from '@/lib/storage';
import { FormSchema } from '@/lib/types';

function mockLocalStorage() {
  const store: Record<string, string> = {};
  const localStorageMock = {
    getItem: jest.fn((k: string) => store[k] ?? null),
    setItem: jest.fn((k: string, v: string) => { store[k] = String(v); }),
    removeItem: jest.fn((k: string) => { delete store[k]; }),
    clear: jest.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
  } as any;
  Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
}

describe('storage', () => {
  beforeEach(() => {
    mockLocalStorage();
  });

  test('save and load schema', () => {
    const schema: FormSchema = { id: 'id1', title: 'T', version: 1, fields: [] };
    saveSchema(schema);
    const loaded = loadSchema();
    expect(loaded).toEqual(schema);
  });
});


