import NavItem from '../NavItem.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('NavItem', () => {
  test('should render correctly', () => {
    const { container } = render(NavItem);
    const navitem = container.querySelector('.nav-item');
    expect(navitem.className).toContain('nav-item');
  });
  test('should render custom class', () => {
    const { container } = render(NavItem, { props: { class: 'putty' } });
    const navitem = container.querySelector('.nav-item');
    expect(navitem.className).toContain('putty');
  });
});
