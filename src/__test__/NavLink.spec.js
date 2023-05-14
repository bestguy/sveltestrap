import NavLink from '../NavLink';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('NavLink', () => {
    test('should render correctly', () => {
        const { container } = render(NavLink);
        const navlink = container.querySelector('.nav-link');
        expect(navlink.className).toContain('nav-link');
    });
    test('should render custom class', () => {
        const { container } = render(NavLink, { props: { class: 'star' } });
        const navlink = container.querySelector('.nav-link');
        expect(navlink.className).toContain('star');
    });
});