import { cleanup } from '@testing-library/vue';
import { afterEach } from 'vitest';
import 'vitest-dom/extend-expect';
import './msw';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
