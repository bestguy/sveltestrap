import ModalBody from '../ModalBody.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ModalBody', () => {
  test('should render correctly', () => {
    const { container } = render(ModalBody);
    const component = container.querySelector('.modal-body');
    expect(component.className).toBe('modal-body');
  });

  test('should render custom class', () => {
    const { container } = render(ModalBody, { props: { class: 'boogie' } });

    const component = container.querySelector('.modal-body');
    expect(component.className).toBe('boogie modal-body');
  });
});
