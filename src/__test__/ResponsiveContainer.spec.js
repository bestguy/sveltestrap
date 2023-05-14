import ResponsiveContainer from '../ResponsiveContainer';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ResponsiveContainer', () => {
  test('should render correctly', () => {
    const { container } = render(ResponsiveContainer, {
      props: { responsive: true }
    });
    const responsivecontainer = container.querySelector('.table-responsive');
    expect(responsivecontainer.className).toContain('table-responsive');
  });
});
