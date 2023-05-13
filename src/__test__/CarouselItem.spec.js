import CarouselItem from '../CarouselItem.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CarouselItem', () => {
    test('should render correctly', () => {
        const { container } = render(CarouselItem);
        const carouselitem = container.querySelector('.carousel-item');
        expect(carouselitem.className).toContain('carousel-item');
    });

    test('should render custom class', () => {
        const { container } = render(CarouselItem, { props: { class: 'cocoa' } });
        const carouselitem = container.querySelector('.carousel-item');
        expect(carouselitem.className).toContain('cocoa');
    });
});