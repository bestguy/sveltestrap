import CardTitle from '../CardTitle.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardTitle', () => {
  test('should render correctly', () => {
    const { container } = render(CardTitle);
    const component = container.querySelector('.card-title');
    expect(component.className).toBe('card-title');
  });

  test('should render custom class', () => {
    const { container } = render(CardTitle, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-title');
    expect(component.className).toBe('boogie card-title');
  });
});
