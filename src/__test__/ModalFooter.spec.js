import ModalFooter from '../ModalFooter.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ModalFooter', () => {
  test('should render correctly', () => {
    const { container } = render(ModalFooter);
    const component = container.querySelector('.modal-footer');
    expect(component.className).toBe('modal-footer');
  });

  test('should render custom class', () => {
    const { container } = render(ModalFooter, { props: { class: 'boogie' } });

    const component = container.querySelector('.modal-footer');
    expect(component.className).toBe('boogie modal-footer');
  });
});
