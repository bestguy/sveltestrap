import Button from '../Button.svelte';
import { render, cleanup } from '@testing-library/svelte';

const renderButton = (props) => {
  const { container } = render(Button, { props });
  return container;
};

beforeEach(cleanup);

describe('Button', () => {
  test('should render text and default color', () => {
    const container = renderButton({ children: 'Hello world!' });
    const button = container.querySelector('.btn');
    expect(button.innerHTML).toBe('Hello world!');
    expect(button.className).toBe('btn btn-secondary');
  });

  test('should render specified color', () => {
    const container = renderButton({ color: 'primary' });
    const button = container.querySelector('.btn');
    expect(button.className).toBe('btn btn-primary');
  });

  test('should render outline', () => {
    const container = renderButton({ color: 'warning', outline: true });
    const button = container.querySelector('.btn');
    expect(button.className).toBe('btn btn-outline-warning');
  });

  test('should render sm size', () => {
    const container = renderButton({ size: 'sm' });
    const button = container.querySelector('.btn');
    expect(button.className).toBe('btn btn-secondary btn-sm');
  });

  test('should render lg size', () => {
    const container = renderButton({ size: 'lg' });
    const button = container.querySelector('.btn');
    expect(button.className).toBe('btn btn-secondary btn-lg');
  });

  test('should render block', () => {
    const container = renderButton({ block: true });
    const button = container.querySelector('.btn');
    expect(button.className).toBe('btn btn-secondary d-block w-100');
  });

  test('should render disabled', () => {
    const container = renderButton({ disabled: true });
    const button = container.querySelector('.btn');

    button.setAttribute('disabled', 'true');
    expect(button.getAttribute('disabled')).toBe('true');
  });

  test('should render active', () => {
    const container = renderButton({ active: true });
    const button = container.querySelector('.btn');
    expect(button.className).toBe('btn btn-secondary active');
  });

  test('should render as close', () => {
    const container = renderButton({ close: true });
    const button = container.querySelector('.btn-close');
    expect(button.className).toBe('btn-close');
  });

  test('should render as link if href specified', () => {
    const container = renderButton({ href: 'http://example.com/' });
    const link = container.querySelector('a');
    expect(link.className).toBe('btn btn-secondary');
    expect(link.href).toBe('http://example.com/');
  });

  test('should render value', () => {
    const container = renderButton({ value: '$1000000' });
    const button = container.querySelector('.btn');
    expect(button.getAttribute('value')).toBe('$1000000');
  });

  test('should render custom class', () => {
    const container = renderButton({ color: 'danger', class: 'boogie' });
    const button = container.querySelector('.btn');
    expect(button.className).toBe('boogie btn btn-danger');
  });
});
