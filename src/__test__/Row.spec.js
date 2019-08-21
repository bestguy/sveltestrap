import Row from '../Row.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Row', () => {
  test('should render correctly', () => {
    const { container } = render(Row);
    const row = container.querySelector('.row');
    expect(row.className).toBe('row');
  });

  test('should render noGutters', () => {
    const { container } = render(Row, { props: { noGutters: true } });
    const row = container.querySelector('.row');
    expect(row.className).toBe('no-gutters row');
  });

  test('should render form row', () => {
    const { container } = render(Row, { props: { form: true } });
    const row = container.querySelector('.form-row');
    expect(row.className).toBe('form-row');
  });

  test('should render custom class', () => {
    const { container } = render(Row, { props: { class: 'boogie' } });
    const row = container.querySelector('.row');
    expect(row.className).toBe('boogie row');
  });
});
