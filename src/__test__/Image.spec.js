import Image from '../Image.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Image', () => {
  test('should render correctly', () => {
    const { container } = render(Image);
    const component = container.querySelector('img');
    expect(component).toBeDefined();
  });

  test('should be figure', () => {
    const { container } = render(Image, { props: { figure: true } });

    const component = container.querySelector('img');
    expect(component.className).toBe('figure-img');
  });

  test('should be fluid', () => {
    const { container } = render(Image, { props: { fluid: true } });

    const component = container.querySelector('img');
    expect(component.className).toBe('img-fluid');
  });

  test('should be thumbnail', () => {
    const { container } = render(Image, { props: { thumbnail: true } });

    const component = container.querySelector('img');
    expect(component.className).toBe('img-thumbnail');
  });

  test('should render custom class', () => {
    const { container } = render(Image, { props: { class: 'boogie' } });

    const component = container.querySelector('img');
    expect(component.className).toBe('boogie');
  });

  test.todo('should render correctly inside Figure'); // TODO when slots/context easier to test
});
