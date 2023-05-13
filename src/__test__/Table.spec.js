import Table from '../Table.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Table', () => {
    test('should render correctly', () => {
        const { container } = render(Table);
        const table = container.querySelector('.table');
        expect(table.className).toContain('table');
    });
    test('should render custom class', () => {
        const { container } = render(Table, { props: { class: 'legged' } });
        const table = container.querySelector('.table');
        expect(table.className).toContain('legged');
    });
});