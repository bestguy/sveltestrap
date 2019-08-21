import Badge from '../Badge.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Badge', () => {
  test('should render text and default color', () => {
    const { container } = render(Badge, { props: { children: 'Hello world!' } });
    const badge = container.querySelector('.badge');
    expect(badge.innerHTML).toBe('Hello world!');
    expect(badge.className).toBe('badge badge-secondary');
  });

  test('should render specified color', () => {
    const { container } = render(Badge, { props: { color: 'primary', children: 'Hello world!' } });
    const badge = container.querySelector('.badge');
    expect(badge.className).toBe('badge badge-primary');
  });

  test('should render custom class', () => {
    const { container } = render(Badge, { props: { color: 'danger', children: 'Hello world!', class: 'boogie' } });
    const badge = container.querySelector('.badge');
    expect(badge.className).toBe('boogie badge badge-danger');
  });

  test('should render pill', () => {
    const { container } = render(Badge, { props: { pill: true, children: 'Hello world!' } });
    const badge = container.querySelector('.badge');
    expect(badge.className).toBe('badge badge-secondary badge-pill');
  });

  test('should render link with href', () => {
    const { container } = render(Badge, { props: { href: 'http://example.com/' } });
    const link = container.querySelector('a');
    expect(link.className).toBe('badge badge-secondary');
    expect(link.href).toBe('http://example.com/');
  });
});
