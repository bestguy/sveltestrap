import ButtonGroup from '../ButtonGroup.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ButtonGroup', () => {
  test('should render correctly', () => {
    const { container } = render(ButtonGroup);
    const group = container.querySelector('.btn-group');
    expect(group.className).toBe('btn-group');
  });

  test('should render specified size', () => {
    const { container } = render(ButtonGroup, { props: { size: 'sm' } });
    const group = container.querySelector('.btn-group');
    expect(group.className).toBe('btn-group-sm btn-group');
  });

  test('should render vertical', () => {
    const { container } = render(ButtonGroup, { props: { vertical: true } });
    const group = container.querySelector('.btn-group-vertical');
    expect(group.className).toBe('btn-group-vertical');
  });

  test('should render custom class', () => {
    const { container } = render(ButtonGroup, { props: { class: 'boogie' } });
    const group = container.querySelector('.btn-group');
    expect(group.className).toBe('boogie btn-group');
  });
});
