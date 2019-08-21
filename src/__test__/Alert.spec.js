import Alert from '../Alert.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Alert', () => {
  test('should render text and default color', () => {
    const { container } = render(Alert, { props: { children: 'Hello world!' } });
    const alert = container.querySelector('.alert');
    expect(alert.innerHTML.trim()).toBe('Hello world!');
    expect(alert.className).toBe('alert alert-success');
  });

  test('should render specified color', () => {
    const { container } = render(Alert, { props: { color: 'primary', children: 'Hello world!' } });
    const alert = container.querySelector('.alert');
    expect(alert.className).toBe('alert alert-primary');
  });

  test('should render custom class', () => {
    const { container } = render(Alert, { props: { color: 'danger', children: 'Hello world!', class: 'boogie' } });
    const alert = container.querySelector('.alert');
    expect(alert.className).toBe('boogie alert alert-danger');
  });
});
