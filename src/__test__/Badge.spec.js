import Badge from '../Badge.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Badge', () => {
  test('should render text and default color', () => {
    const { queryByRole } = render(Badge, {
      props: { children: 'Hello world!' }
    });
    const badge = queryByRole('status');
    expect(badge.tagName).toEqual('SPAN');
    expect(badge.innerHTML).toEqual('Hello world!');
    expect(badge.className).toEqual('badge bg-secondary');
  });

  test('should render specified color', () => {
    const { queryByRole } = render(Badge, {
      props: { color: 'primary', children: 'Hello world!' }
    });
    const badge = queryByRole('status');
    expect(badge.tagName).toEqual('SPAN');
    expect(badge.innerHTML).toEqual('Hello world!');
    expect(badge.className).toEqual('badge bg-primary');
  });

  test('should render custom class', () => {
    const { queryByRole } = render(Badge, {
      props: { color: 'danger', children: 'Hello world!', class: 'boogie' }
    });
    const badge = queryByRole('status');
    expect(badge.tagName).toEqual('SPAN');
    expect(badge.innerHTML).toEqual('Hello world!');
    expect(badge.className).toEqual('boogie badge bg-danger');
  });

  test('should render pill', () => {
    const { queryByRole } = render(Badge, {
      props: { pill: true, children: 'Hello world!' }
    });
    const badge = queryByRole('status');
    expect(badge.tagName).toEqual('SPAN');
    expect(badge.innerHTML).toEqual('Hello world!');
    expect(badge.className).toBe('badge bg-secondary rounded-pill');
  });

  test('should render link with href', () => {
    const { queryByText } = render(Badge, {
      props: { href: 'http://example.com/', children: 'Link' }
    });

    const link = queryByText("Link");
    expect(link.tagName).toEqual('A');
    expect(link.innerHTML).toEqual('Link');
    expect(link.className).toEqual('badge bg-secondary');
    expect(link.href).toEqual('http://example.com/');
  });
});
