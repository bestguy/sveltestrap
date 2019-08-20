import Container from '../Container.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Container', () => {
  test('should render correctly', () => {
    const { container } = render(Container);
    const component = container.querySelector('.container');
    expect(component.className).toBe('container');
  });

  test('should render fluid', () => {
    const { container } = render(Container, { props: { fluid: true } });
    const component = container.querySelector('.container-fluid');
    expect(component.className).toBe('container-fluid');
  });

  test('should render custom class', () => {
    const { container } = render(Container, { props: { class: 'boogie' } });
    const component = container.querySelector('.container');
    expect(component.className).toBe('boogie container');
  });
});
