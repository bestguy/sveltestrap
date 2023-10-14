import ModalHeader from '../ModalHeader.svelte';
import {jest} from '@jest/globals';
import { fireEvent, render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('ModalHeader', () => {
  test('should render correctly', () => {
    const { container } = render(ModalHeader, { props: { children: 'Zap' } });
    const component = container.querySelector('.modal-header');
    expect(component.className).toBe('modal-header');
    const title = container.querySelector('.modal-title');
    expect(title.innerHTML).toBe('Zap');
    expect(container.querySelector('button')).toBeNull();
  });

  test('should render close if toggle specified', () => {
    const toggle = jest.fn();
    const { container } = render(ModalHeader, { props: { toggle } });
    const component = container.querySelector('.modal-header');
    expect(component.className).toBe('modal-header');
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(toggle.mock.calls.length).toEqual(1);
  });

  test('should render custom class', () => {
    const { container } = render(ModalHeader, { props: { class: 'boogie' } });

    const component = container.querySelector('.modal-header');
    expect(component.className).toBe('boogie modal-header');
  });
});
