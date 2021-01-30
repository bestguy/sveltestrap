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

  test('should support cols number', () => {
    const { container } = render(Row, { props: { cols: '2' } });
    const row = container.querySelector('.row');
    expect(row.className).toBe('row row-cols-2');
  });

  test('should support cols object', () => {
    const { container } = render(Row, { props: { cols: { sm: 2, md: 3 } } });
    const row = container.querySelector('.row');
    expect(row.className).toBe('row row-cols-sm-2 row-cols-md-3');
  });
});
