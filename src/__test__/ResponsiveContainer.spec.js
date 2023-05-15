import ResponsiveContainer from '../ResponsiveContainer';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ResponsiveContainer', () => {
    test('should render correctly', () => {
        const { container } = render(ResponsiveContainer, {
            props: { responsive: true }
        });
        const responsivecontainer = container.querySelector('.table-responsive');
        expect(responsivecontainer.className).toContain('table-responsive');
    });
    test('should render custom class', () => {
        const { container } = render(ResponsiveContainer, {
            props: { responsive: true, class: 'kittens' }
        });
        const responsivecontainer = container.querySelector('.table-responsive');
        expect(responsivecontainer.className).toContain('kittens');
    });
    test('should render responsive size', () => {
        const { container } = render(ResponsiveContainer, {
            props: { responsive: 'lg' }
        });
        const responsivecontainer = container.querySelector('.table-responsive-lg');
        expect(responsivecontainer.className).toContain('table-responsive-lg');
    });

    test.todo('responsive === false') // default
});
