import TestDropdown from './TestDropdown';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('DropdownMenu', () => {
  test('should render correctly', () => {
    const { container } = render(TestDropdown);
    const dropdownmenu = container.querySelector('.dropdown-menu');
    expect(dropdownmenu.className).toContain('dropdown-menu');
  });
  test('should render custom class', () => {
    const { container } = render(TestDropdown, { props: { class: 'cocoa' } });
    const dropdownmenu = container.querySelector('.dropdown-menu');
    expect(dropdownmenu.className).toContain('cocoa');
  });
});
