import Progress from '../Progress.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Progress', () => {
  test('should render correctly', () => {
    const { container } = render(Progress);
    const progress = container.querySelector('.progress');
    expect(progress.className).toContain('progress');
  });

  test('should render specified color', () => {
    const { container } = render(Progress, { props: { color: 'primary' } });
    const progress = container.querySelector('.progress-bar');
    expect(progress.className).toContain('progress-bar');
    expect(progress.className).toContain('text-bg-primary');
  });

  test('should render custom class', () => {
    const { container } = render(Progress, { props: { class: 'end' } });
    const progress = container.querySelector('.progress');
    expect(progress.className).toContain('end');
  });
});
