import ToastBody from '../ToastBody.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ToastBody', () => {
  test('should render correctly', () => {
    const { container } = render(ToastBody);
    const component = container.querySelector('.toast-body');
    expect(component.className).toBe('toast-body');
  });

  test('should render custom class', () => {
    const { container } = render(ToastBody, { props: { class: 'boogie' } });

    const component = container.querySelector('.toast-body');
    expect(component.className).toBe('boogie toast-body');
  });
});
