import TestAccordion from './TestAccordion.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('AccordionHeader', () => {
  test('should render correctly', () => {
    const { container } = render(TestAccordion);
    const accordionheader = container.querySelector('.accordion-header');
    expect(accordionheader.className).toContain('accordion-header');
    expect(accordionheader.textContent).toContain('Header!');
  });
});
