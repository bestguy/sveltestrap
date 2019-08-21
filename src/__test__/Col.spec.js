import Col from '../Col.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('Col', () => {
  test('should render correctly', () => {
    const { container } = render(Col);
    const col = container.querySelector('.col');
    expect(col.className).toBe('col');
  });

  test('should render correct sizes', () => {
    const { container } = render(Col, { props: { class: 'test', xs: 1, sm: 2, md: 3, lg: 4, xl: 5 } });
    const col = container.querySelector('.test');
    expect(col.className).toBe('col-1 col-sm-2 col-md-3 col-lg-4 col-xl-5 test');
  });

  test('should render correct sizes with objects', () => {
    const { container } = render(Col, { props: { class: 'test', md: { size: 1, pull: 2, push: 3, offset: 4 } } });
    const col = container.querySelector('.test');
    expect(col.className).toBe('col-md-1 push-md-3 pull-md-2 offset-md-4 test');
  });
});
