import InputGroup from '../InputGroup.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('InputGroup', () => {
    test('should render correctly', () => {
        const { container } = render(InputGroup);
        const inputgroup = container.querySelector('.input-group');
        expect(inputgroup.className).toContain('input-group');
    });
    test('should render custom class', () => {
        const { container } = render(InputGroup, { props: { class: 'many' } });
        const inputgroup = container.querySelector('.input-group');
        expect(inputgroup.className).toContain('many');
    });
});