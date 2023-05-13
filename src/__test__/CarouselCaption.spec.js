import CarouselCaption from '../CarouselCaption.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CarouselCaption', () => {
    test('should render correctly', () => {
        const { container } = render(CarouselCaption);
        const carouselcaption = container.querySelector('.carousel-caption');
        expect(carouselcaption.className).toContain('carousel-caption');
    });
    test('should render custom class', () => {
        const { container } = render(CarouselCaption, { props: { class: 'horse' } });
        const carouselcaption = container.querySelector('.carousel-caption');
        expect(carouselcaption.className).toContain('horse');
    });
});