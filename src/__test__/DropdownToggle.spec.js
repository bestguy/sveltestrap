import TestDropdown from './TestDropdown';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('DropdownToggle', () => {
  test('should render correctly', () => {
    const { container } = render(TestDropdown);
    const dropdowntoggle = container.querySelector('.dropdown-toggle');
    expect(dropdowntoggle.className).toContain('dropdown-toggle');
    expect(dropdowntoggle.className).toContain('btn');
  });

  test('should render custom class', () => {
    const { container } = render(TestDropdown);
    const dropdowntoggle = container.querySelector('.dropdown-toggle');
    expect(dropdowntoggle.className).toContain('coconut');
  });
});
