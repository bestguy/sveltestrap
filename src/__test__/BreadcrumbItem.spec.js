import BreadcrumbItem from '../BreadcrumbItem.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('BreadcrumbItem', () => {
  test('should render correctly', () => {
    const { container } = render(BreadcrumbItem, {
      props: { children: 'Alpha' }
    });
    const item = container.querySelector('.breadcrumb-item');
    expect(item.innerHTML).toBe('Alpha');
    expect(item.className).toBe('breadcrumb-item');
  });

  test('should render active', () => {
    const { container } = render(BreadcrumbItem, { props: { active: true } });
    const item = container.querySelector('.breadcrumb-item');
    expect(item.className).toBe('active breadcrumb-item');
  });

  test('should render custom class', () => {
    const { container } = render(BreadcrumbItem, {
      props: { class: 'boogie', listClassName: 'shoes' }
    });
    const item = container.querySelector('.breadcrumb-item');
    expect(item.className).toBe('boogie breadcrumb-item');
  });
});
