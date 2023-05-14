import FormCheck from '../FormCheck.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('FormCheck', () => {
    test('should render correctly', () => {
        const { container } = render(FormCheck);
        const formcheck = container.querySelector('.form-check');
        expect(formcheck.className).toContain('form-check');
    });
    test('should render custom class', () => {
        const { container } = render(FormCheck, { props: { class: 'good' } });
        const formcheck = container.querySelector('.form-check');
        expect(formcheck.className).toContain('good');
    });
});