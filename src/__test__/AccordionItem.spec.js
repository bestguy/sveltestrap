import TestAccordion from './TestAccordion.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('AccordionItem', () => {
  test('should render correctly', () => {
    const { container } = render(TestAccordion);
    const accordionitem = container.querySelector('.accordion-item');
    expect(accordionitem.className).toContain('accordion-item');
  });
  test('should render custom class', () => {
    const { container } = render(TestAccordion);
    const accordionitem = container.querySelector('.accordion-item');
    expect(accordionitem.className).toContain('peek-a-boo');
  });
});
