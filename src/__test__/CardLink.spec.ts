import CardLink from '../CardLink.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardLink', () => {
  test('should render correctly', () => {
    const { container } = render(CardLink);
    const component = container.querySelector('.card-link');
    expect(component.className).toBe('card-link');
  });

  test('should render custom class', () => {
    const { container } = render(CardLink, { props: { class: 'boogie' } });
    const component = container.querySelector('.card-link');
    expect(component.className).toBe('boogie card-link');
  });

  test('should render link with href', () => {
    const { container } = render(CardLink, {
      props: { href: 'http://example.com/' }
    });
    const link = container.querySelector('a');
    expect(link.href).toBe('http://example.com/');
  });
});
