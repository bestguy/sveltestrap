import ListGroup from '../ListGroup.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ListGroup', () => {
  test('should render correctly', () => {
    const { container } = render(ListGroup);
    const component = container.querySelector('ul.list-group');
    expect(component.className).toBe('list-group');
  });

  test('should render flush', () => {
    const { container } = render(ListGroup, { props: { flush: true } });
    const component = container.querySelector('.list-group');
    expect(component.className).toBe('list-group list-group-flush');
  });

  test('should render numbered', () => {
    const { container } = render(ListGroup, { props: { numbered: true } });
    const component = container.querySelector('ol.list-group');
    expect(component.className).toBe('list-group list-group-numbered');
  });

  test('should render custom class', () => {
    const { container } = render(ListGroup, { props: { class: 'boogie' } });
    const component = container.querySelector('.list-group');
    expect(component.className).toBe('boogie list-group');
  });
});
