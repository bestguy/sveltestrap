import Card from '../Card.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Card', () => {
  test('should render correctly', () => {
    const { container } = render(Card);
    const component = container.querySelector('.card');
    expect(component.className).toBe('card');
  });

  test.todo('inverse');
  test.todo('body');
  test.todo('color');

  test('should render custom class', () => {
    const { container } = render(Card, { props: { class: 'boogie' } });

    const component = container.querySelector('.card');
    expect(component.className).toBe('boogie card');
  });
});
