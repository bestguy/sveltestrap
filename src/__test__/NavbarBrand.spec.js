import NavbarBrand from '../NavbarBrand';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('NavbarBrand', () => {
  test('should render correctly', () => {
    const { container } = render(NavbarBrand);
    const navbarbrand = container.querySelector('.navbar-brand');
    expect(navbarbrand.className).toContain('navbar-brand');
  });
  test('should render custom class', () => {
    const { container } = render(NavbarBrand, { props: { class: 'gulp' } });
    const navbarbrand = container.querySelector('.navbar-brand');
    expect(navbarbrand.className).toContain('gulp');
  });
});
