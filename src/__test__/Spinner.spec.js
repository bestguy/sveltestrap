import Spinner from '../Spinner.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Spinner', () => {
  test('should render default color and type', () => {
    const { container } = render(Spinner);
    const spinner = container.querySelector('.spinner-border');
    expect(spinner.className).toBe('spinner-border');
  });

  test('should render specified color', () => {
    const { container } = render(Spinner, { props: { color: 'primary' } });
    const spinner = container.querySelector('.spinner-border');
    expect(spinner.className).toBe('spinner-border text-primary');
  });

  test('should render specified type', () => {
    const { container } = render(Spinner, {
      props: { color: 'warning', type: 'grow' }
    });
    const spinner = container.querySelector('.spinner-grow');
    expect(spinner.className).toBe('spinner-grow text-warning');
  });

  test('should render large size', () => {
    const { container } = render(Spinner, { props: { size: 'lg' } });
    const spinner = container.querySelector('.spinner-border');
    expect(spinner.className).toBe('spinner-border-lg spinner-border');
  });

  test('should render small size', () => {
    const { container } = render(Spinner, { props: { size: 'sm' } });
    const spinner = container.querySelector('.spinner-border');
    expect(spinner.className).toBe('spinner-border-sm spinner-border');
  });

  test('should render custom class', () => {
    const { container } = render(Spinner, {
      props: { color: 'danger', class: 'boogie' }
    });
    const spinner = container.querySelector('.spinner-border');
    expect(spinner.className).toBe('boogie spinner-border text-danger');
  });
});
