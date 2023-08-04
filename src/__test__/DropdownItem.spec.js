import DropdownItem from '../DropdownItem';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('DropdownItem', () => {
  test('should render correctly', () => {
    const { container } = render(DropdownItem);
    const dropdownitem = container.querySelector('.dropdown-item');
    expect(dropdownitem.className).toContain('dropdown-item');
  });
  test('should render custom class', () => {
    const { container } = render(DropdownItem, { props: { class: 'coconut' } });
    const dropdownitem = container.querySelector('.dropdown-item');
    expect(dropdownitem.className).toContain('coconut');
  });
});
