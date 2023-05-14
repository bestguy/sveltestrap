import NavbarToggler from '../NavbarToggler';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('NavbarToggler', () => {
  test('should render correctly', () => {
    const { container } = render(NavbarToggler);
    const navbartoggler = container.querySelector('.navbar-toggler');
    expect(navbartoggler.className).toContain('navbar-toggler');
  });
  test('should render custom class', () => {
    const { container } = render(NavbarToggler, { props: { class: 'push' } });
    const navbartoggler = container.querySelector('.navbar-toggler');
    expect(navbartoggler.className).toContain('push');
  });
});
