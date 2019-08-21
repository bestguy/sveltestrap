import CardDeck from '../CardDeck.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardDeck', () => {
  test('should render correctly', () => {
    const { container } = render(CardDeck);
    const component = container.querySelector('.card-deck');
    expect(component.className).toBe('card-deck');
  });

  test('should render custom class', () => {
    const { container } = render(CardDeck, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-deck');
    expect(component.className).toBe('boogie card-deck');
  });
});
