import Pagination from '../Pagination';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Pagination', () => {
  test('should render correctly', () => {
    const { container } = render(Pagination);
    const pagination = container.querySelector('.pagination');
    expect(pagination.className).toContain('pagination');
  });
});
