import Badge from '../Badge.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Badge', () => {
  test('should render text and default color', () => {
    const { container } = render(Badge, {
      props: { children: 'Hello world!' }
    });
    const badge = container.querySelector('.badge');
    expect(badge.innerHTML).toBe('Hello world!');
    expect(badge.className).toBe('badge bg-secondary');
  });

  test('should render specified color', () => {
    const { container } = render(Badge, {
      props: { color: 'primary', children: 'Hello world!' }
    });
    const badge = container.querySelector('.badge');
    expect(badge.className).toBe('badge bg-primary');
  });

  test('should render custom class', () => {
    const { container } = render(Badge, {
      props: { color: 'danger', children: 'Hello world!', class: 'boogie' }
    });
    const badge = container.querySelector('.badge');
    expect(badge.className).toBe('boogie badge bg-danger');
  });

  test('should render pill', () => {
    const { container } = render(Badge, {
      props: { pill: true, children: 'Hello world!' }
    });
    const badge = container.querySelector('.badge');
    expect(badge.className).toBe('badge bg-secondary rounded-pill');
  });

  test('should render link with href', () => {
    const { container } = render(Badge, {
      props: { href: 'http://example.com/' }
    });
    const link = container.querySelector('a');
    expect(link.className).toBe('badge bg-secondary');
    expect(link.href).toBe('http://example.com/');
  });
});
