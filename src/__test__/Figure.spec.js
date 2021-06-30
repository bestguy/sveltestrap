import Figure from '../Figure.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Figure', () => {
  test('should render correctly', () => {
    const { container } = render(Figure);
    const component = container.querySelector('figure');
    expect(component.className).toBe('figure');
  });

  test('should render custom class', () => {
    const { container } = render(Figure, { props: { class: 'boogie' } });

    const component = container.querySelector('figure');
    expect(component.className).toBe('figure boogie');
  });

  test('should render caption', () => {
    const { container } = render(Figure, { props: { caption: 'I want to put on my my my my my boogie shoes' } });

    const component = container.querySelector('figure > figcaption');
    expect(component.className).toBe('figure-caption');
    expect(component.textContent).toBe('I want to put on my my my my my boogie shoes');
  });
});
