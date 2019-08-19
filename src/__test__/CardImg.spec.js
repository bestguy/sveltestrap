import CardImg from '../CardImg.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardImg', () => {
  test('should render correctly', () => {
    const { container } = render(CardImg);
    const component = container.querySelector('.card-img');
    expect(component.className).toBe('card-img');
  });

  test.todo('top');
  test.todo('bottom');
  test.todo('src');
  test.todo('alt');

  test('should render custom class', () => {
    const { container } = render(CardImg, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-img');
    expect(component.className).toBe('boogie card-img');
  });
});
