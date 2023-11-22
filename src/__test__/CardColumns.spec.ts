import CardColumns from '../CardColumns.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardColumns', () => {
  test('should render correctly', () => {
    const { container } = render(CardColumns);
    const component = container.querySelector('.card-columns');
    expect(component.className).toBe('card-columns');
  });

  test('should render custom class', () => {
    const { container } = render(CardColumns, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-columns');
    expect(component.className).toBe('boogie card-columns');
  });
});
