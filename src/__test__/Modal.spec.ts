import Modal from '../Modal.svelte';
import { jest } from '@jest/globals';
import { render, cleanup, fireEvent } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Modal', () => {
  test('should close when escape is pressed', async () => {
    const toggle = jest.fn();
    const { component } = render(Modal, { props: { toggle, isOpen: true } });
    await new Promise((resolve) => component.$on('open', resolve));
    await fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle).toHaveBeenCalled();
  });

  test('should not reopen when escape is pressed twice', async () => {
    const toggle = jest.fn();
    const { component } = render(Modal, { props: { toggle, isOpen: true } });
    await new Promise((resolve) => component.$on('open', resolve));
    await Promise.all([
      fireEvent.keyDown(document, { key: 'Escape' }),
      fireEvent.keyDown(document, { key: 'Escape' })
    ]);
    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
