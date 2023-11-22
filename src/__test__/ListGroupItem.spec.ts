import ListGroupItem from '../ListGroupItem.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ListGroupItem', () => {
  test('should render correctly', () => {
    const { container } = render(ListGroupItem);
    const component = container.querySelector('li.list-group-item');
    expect(component.className).toBe('list-group-item');
  });

  test('should render action', () => {
    const { container } = render(ListGroupItem, { props: { action: true } });
    const component = container.querySelector('.list-group-item');
    expect(component.className).toBe('list-group-item list-group-item-action');
  });

  test('should render action if button', () => {
    const { container } = render(ListGroupItem, { props: { tag: 'button' } });
    const component = container.querySelector('button.list-group-item');
    expect(component.className).toBe('list-group-item list-group-item-action');
  });

  test('should render a if href', () => {
    const { container } = render(ListGroupItem, {
      props: { href: 'http://www.example.com' }
    });
    const component = container.querySelector('a.list-group-item');
    expect(component.className).toBe('list-group-item');
  });

  test('should render color', () => {
    const { container } = render(ListGroupItem, {
      props: { color: 'primary' }
    });
    const component = container.querySelector('.list-group-item');
    expect(component.className).toBe('list-group-item list-group-item-primary');
  });

  test('should render custom class', () => {
    const { container } = render(ListGroupItem, { props: { class: 'boogie' } });
    const component = container.querySelector('.list-group-item');
    expect(component.className).toBe('boogie list-group-item');
  });
});
