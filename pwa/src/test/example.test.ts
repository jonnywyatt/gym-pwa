import { describe, expect, it } from 'vitest';

describe('Example Test', () => {
  it('should pass a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should work with async code', async () => {
    const result = await Promise.resolve('hello');
    expect(result).toBe('hello');
  });
});
