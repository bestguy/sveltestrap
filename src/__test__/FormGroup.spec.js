import FormGroup from '../FormGroup.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('FormGroup', () => {
    test('should render correctly', () => {
        const { container } = render(FormGroup);
        const formgroup = container.querySelector('.mb-3');
        expect(formgroup.className).toContain('mb-3');
    });
    test('should render custom class', () => {
        const { container } = render(FormGroup, { props: { class: 'paint' } });
        const formgroup = container.querySelector('.mb-3');
        expect(formgroup.className).toContain('paint');
    });
});