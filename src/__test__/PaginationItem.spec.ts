import PaginationItem from '../PaginationItem.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('PaginationItem', () => {
  test('should render correctly', () => {
    const { container } = render(PaginationItem);
    const paginationitem = container.querySelector('.page-item');
    expect(paginationitem.className).toContain('page-item');
  });
  test('should render custom class', () => {
    const { container } = render(PaginationItem, { props: { class: 'long' } });
    const paginationitem = container.querySelector('.page-item');
    expect(paginationitem.className).toContain('long');
  });
});
