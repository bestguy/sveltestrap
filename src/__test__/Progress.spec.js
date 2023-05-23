import Progress from '../Progress';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Progress', () => {
  test('should render correctly', () => {
    const { container } = render(Progress);
    const progress = container.querySelector('.progress');
    expect(progress.className).toContain('progress');
  });
  test('should render custom class', () => {
    const { container } = render(Progress, { props: { class: 'end' } });
    const progress = container.querySelector('.progress');
    expect(progress.className).toContain('end');
  });
});
