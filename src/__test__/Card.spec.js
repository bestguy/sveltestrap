import Card from '../Card.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Card', () => {
  test('should render correctly', () => {
    const { container } = render(Card);
    const component = container.querySelector('.card');
    expect(component.className).toBe('card');
  });

  test('should render props', () => {
    const { container } = render(Card, {
      props: { inverse: true, body: true, color: 'primary' }
    });
    const component = container.querySelector('.card');
    expect(component.className).toContain('text-white');
    expect(component.className).toContain('card-body');
    expect(component.className).toContain('bg-primary');
  });

  test('should render custom class', () => {
    const { container } = render(Card, { props: { class: 'boogie' } });

    const component = container.querySelector('.card');
    expect(component.className).toBe('boogie card');
  });
});
