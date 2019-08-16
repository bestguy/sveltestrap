import Breadcrumb from '../Breadcrumb.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Breadcrumb', () => {
  test('should render correctly', () => {
    const { container } = render(Breadcrumb);
    const breadcrumb = container.querySelector('.breadcrumb');
    expect(breadcrumb.className).toBe('breadcrumb');
  });

  test('should render custom class', () => {
    const { container } = render(Breadcrumb, { props: { class: 'boogie', listClassName: 'shoes' } });
    const nav = container.querySelector('nav');
    expect(nav.className).toBe('boogie');

    const breadcrumb = container.querySelector('.breadcrumb');
    expect(breadcrumb.className).toBe('breadcrumb shoes');
  });
});
