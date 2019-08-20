import CardBody from '../CardBody.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardBody', () => {
  test('should render correctly', () => {
    const { container } = render(CardBody);
    const component = container.querySelector('.card-body');
    expect(component.className).toBe('card-body');
  });

  test('should render custom class', () => {
    const { container } = render(CardBody, { props: { class: 'boogie' } });

    const component = container.querySelector('.card-body');
    expect(component.className).toBe('boogie card-body');
  });
});
