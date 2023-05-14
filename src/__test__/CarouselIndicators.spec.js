import CarouselIndicators from '../CarouselIndicators.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CarouselIndicators', () => {
    test('should render correctly', () => {
        const { container } = render(CarouselIndicators);
        const carouselindicators = container.querySelector('.carousel-indicators');
        expect(carouselindicators.className).toContain('carousel-indicators');
    });
    test('should render custom class', () => {
        const { container } = render(CarouselIndicators, { props: { class: 'around' } });
        const carouselindicators = container.querySelector('.carousel-indicators');
        expect(carouselindicators.className).toContain('around');
    });
});