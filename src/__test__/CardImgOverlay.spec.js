import CardImgOverlay from '../CardImgOverlay.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardImgOverlay', () => {
  test('should render correctly', () => {
    const { container } = render(CardImgOverlay);
    const component = container.querySelector('.card-img-overlay');
    expect(component.className).toBe('card-img-overlay');
  });

  test('should render custom class', () => {
    const { container } = render(CardImgOverlay, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-img-overlay');
    expect(component.className).toBe('boogie card-img-overlay');
  });
});
