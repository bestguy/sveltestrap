import CardSubtitle from '../CardSubtitle.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardSubtitle', () => {
  test('should render correctly', () => {
    const { container } = render(CardSubtitle);
    const component = container.querySelector('.card-subtitle');
    expect(component.className).toBe('card-subtitle');
  });

  test('should render custom class', () => {
    const { container } = render(CardSubtitle, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-subtitle');
    expect(component.className).toBe('boogie card-subtitle');
  });
});
