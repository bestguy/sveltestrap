import CardText from '../CardText.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardText', () => {
  test('should render correctly', () => {
    const { container } = render(CardText);
    const component = container.querySelector('.card-text');
    expect(component.className).toBe('card-text');
  });

  test('should render custom class', () => {
    const { container } = render(CardText, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-text');
    expect(component.className).toBe('boogie card-text');
  });
});
