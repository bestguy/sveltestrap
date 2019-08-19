import CardGroup from '../CardGroup.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardGroup', () => {
  test('should render correctly', () => {
    const { container } = render(CardGroup);
    const component = container.querySelector('.card-group');
    expect(component.className).toBe('card-group');
  });

  test('should render custom class', () => {
    const { container } = render(CardGroup, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-group');
    expect(component.className).toBe('boogie card-group');
  });
});
