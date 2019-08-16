import ButtonToolbar from '../ButtonToolbar.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ButtonToolbar', () => {
  test('should render correctly', () => {
    const { container } = render(ButtonToolbar);
    const group = container.querySelector('.btn-toolbar');
    expect(group.className).toBe('btn-toolbar');
  });

  test('should render custom class', () => {
    const { container } = render(ButtonToolbar, { props: { class: 'boogie' } });
    const group = container.querySelector('.btn-toolbar');
    expect(group.className).toBe('boogie btn-toolbar');
  });
});
