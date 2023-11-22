import Dropdown from '../Dropdown.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Dropdown', () => {
  test('should render correctly', () => {
    const { container } = render(Dropdown);
    const dropdown = container.querySelector('.dropdown');
    expect(dropdown.className).toContain('dropdown');
  });
  test('should render custom class', () => {
    const { container } = render(Dropdown, { props: { class: 'cannonball' } });
    const dropdown = container.querySelector('.dropdown');
    expect(dropdown.className).toContain('cannonball');
  });
});
