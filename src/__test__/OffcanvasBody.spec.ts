import OffcanvasBody from '../OffcanvasBody.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('OffcanvasBody', () => {
  test('should render correctly', () => {
    const { container } = render(OffcanvasBody);
    const component = container.querySelector('.offcanvas-body');
    expect(component.className).toBe('offcanvas-body');
  });

  test('should render custom class', () => {
    const { container } = render(OffcanvasBody, { props: { class: 'boogie' } });

    const component = container.querySelector('.offcanvas-body');
    expect(component.className).toBe('boogie offcanvas-body');
  });
});
