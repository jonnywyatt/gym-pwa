import { describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  it('calls the function after the delay', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('resets the timer on each call, firing only once after the last call', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    vi.advanceTimersByTime(200);
    debounced();
    vi.advanceTimersByTime(200);
    debounced();
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('passes arguments to the wrapped function', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('hello', 42);
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('hello', 42);

    vi.useRealTimers();
  });
});
