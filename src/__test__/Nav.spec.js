import Nav from '../Nav.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Nav', () => {
    test('should render correctly', () => {
        const { container } = render(Nav);
        const nav = container.querySelector('.nav');
        expect(nav.className).toContain('nav');
    });
    test('should render custom class', () => {
        const { container } = render(Nav, { props: { class: 'go' } });
        const nav = container.querySelector('.nav');
        expect(nav.className).toContain('go');
    });
});