import Jumbotron from '../Jumbotron.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Jumbotron', () => {
  test('should render correctly', () => {
    const { container } = render(Jumbotron);
    const jumbotron = container.querySelector('.p-5');
    expect(jumbotron.className).toContain('p-5 mb-4 bg-light rounded-3');
  });

  test('should render custom class', () => {
    const { container } = render(Jumbotron, { props: { class: 'cafe' } });
    const jumbotron = container.querySelector('.p-5');
    expect(jumbotron.className).toContain('cafe');
  });
});
