import PaginationLink from '../PaginationLink';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('PaginationLink', () => {
  test('should render correctly', () => {
    const { container } = render(PaginationLink);
    const paginationlink = container.querySelector('.page-link');
    expect(paginationlink.className).toContain('page-link');
  });
  test('should render custom class', () => {
    const { container } = render(PaginationLink, { props: { class: 'push' } });
    const paginationlink = container.querySelector('.page-link');
    expect(paginationlink.className).toContain('push');
  });
});
