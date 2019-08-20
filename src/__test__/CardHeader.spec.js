import CardHeader from '../CardHeader.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardHeader', () => {
  test('should render correctly', () => {
    const { container } = render(CardHeader);
    const component = container.querySelector('.card-header');
    expect(component.className).toBe('card-header');
  });

  test('should render custom class', () => {
    const { container } = render(CardHeader, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-header');
    expect(component.className).toBe('boogie card-header');
  });
});
