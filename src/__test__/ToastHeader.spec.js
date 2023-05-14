import ToastHeader from '../ToastHeader.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ToastHeader', () => {
  test('should render correctly', () => {
    const { container } = render(ToastHeader);
    const toastheader = container.querySelector('.toast-header');
    expect(toastheader.className).toContain('toast-header');
  });
  test('should render custom class', () => {
    const { container } = render(ToastHeader, { props: { class: 'butter' } });
    const toastheader = container.querySelector('.toast-header');
    expect(toastheader.className).toContain('butter');
  });
});
