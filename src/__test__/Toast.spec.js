import Toast from '../Toast.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Toast', () => {
    test('should render correctly', () => {
        const { container } = render(Toast);
        const toast = container.querySelector('.toast');
        expect(toast.className).toContain('toast');
    });
    test('should render custom class', () => {
        const { container } = render(Toast, { props: { class: 'butter' } });
        const toast = container.querySelector('.toast');
        expect(toast.className).toContain('butter');
    });
});