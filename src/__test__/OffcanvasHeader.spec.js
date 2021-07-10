import OffcanvasHeader from '../OffcanvasHeader.svelte';
import { fireEvent, render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('OffcanvasHeader', () => {
  test('should render correctly', () => {
    const { container } = render(OffcanvasHeader, {
      props: { children: 'Zap' }
    });
    const component = container.querySelector('.offcanvas-header');
    expect(component.className).toBe('offcanvas-header');
    const title = container.querySelector('.offcanvas-title');
    expect(title.innerHTML).toBe('Zap');
    expect(container.querySelector('button')).toBeNull();
  });

  test('should render close if toggle specified', () => {
    const toggle = jest.fn();
    const { container } = render(OffcanvasHeader, { props: { toggle } });
    const component = container.querySelector('.offcanvas-header');
    expect(component.className).toBe('offcanvas-header');
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(toggle.mock.calls.length).toEqual(1);
  });

  test.todo('should render close slot if specified');

  test('should render custom class', () => {
    const { container } = render(OffcanvasHeader, {
      props: { class: 'boogie' }
    });

    const component = container.querySelector('.offcanvas-header');
    expect(component.className).toBe('boogie offcanvas-header');
  });
});
