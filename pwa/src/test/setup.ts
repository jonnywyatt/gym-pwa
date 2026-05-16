import { cleanup } from '@testing-library/vue';
import { afterEach } from 'vitest';
import 'vitest-dom/extend-expect';
import './msw';
import 'fake-indexeddb/auto';

HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
};

HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
};

afterEach(() => {
  cleanup();
});
