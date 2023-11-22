import CardFooter from '../CardFooter.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardFooter', () => {
  test('should render correctly', () => {
    const { container } = render(CardFooter);
    const component = container.querySelector('.card-footer');
    expect(component.className).toBe('card-footer');
  });

  test('should render custom class', () => {
    const { container } = render(CardFooter, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-footer');
    expect(component.className).toBe('boogie card-footer');
  });
});
