import Carousel from '../Carousel';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Carousel', () => {
  test('should render correctly', () => {
    const { container } = render(Carousel);
    const carousel = container.querySelector('.carousel');
    expect(carousel.className).toContain('carousel');
  });
  test('should render custom class', () => {
    const { container } = render(Carousel, { props: { class: 'squeeze' } });
    const carousel = container.querySelector('.carousel');
    expect(carousel.className).toContain('squeeze');
  });
});
