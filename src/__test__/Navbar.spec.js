import Navbar from '../Navbar';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Navbar', () => {
    test('should render correctly', () => {
        const { container } = render(Navbar);
        const navbar = container.querySelector('.navbar');
        expect(navbar.className).toContain('navbar');
    });
    test('should render custom class', () => {
        const { container } = render(Navbar, { props: { class: 'gone' } });
        const navbar = container.querySelector('.navbar');
        expect(navbar.className).toContain('gone');
    });
});