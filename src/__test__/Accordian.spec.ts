import Accordion from '../Accordion.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Accordion', () => {
  test('should render correctly', () => {
    const { container } = render(Accordion);
    const accordion = container.querySelector('.accordion');
    expect(accordion.className).toContain('accordion');
  });
  test('should render custom class', () => {
    const { container } = render(Accordion, { props: { class: 'squeeze' } });
    const accordion = container.querySelector('.accordion');
    expect(accordion.className).toContain('squeeze');
  });
});
