import Popover from '../Popover.svelte';
import Button from '../Button.svelte';
import { render, cleanup } from '@testing-library/svelte';

const renderButton = (props) => {
  const { container } = render(Button, { props });
  container.id = 'btn';
  return container;
};

const renderPopover = (props) => {
  const { container } = render(Popover, { props });
  return container;
};

const POPOVER_POSITION_CLASS = {
  top: 'bs-popover-top',
  bottom: 'bs-popover-bottom',
  left: 'bs-popover-left',
  right: 'bs-popover-right',
};

beforeEach(() => {
  cleanup();
  renderButton({ children: 'Hello BTN' });
});

describe('Popover test', () => {
  it('should render text and default placement(top)', () => {
    const containerPopover = renderPopover({
      children: 'Hello',
      target: 'btn'
    });
    const popover = containerPopover.querySelector('.popover');
    const popoverContent = containerPopover.querySelector('.popover .popover-body');
    expect(popover.className.includes(POPOVER_POSITION_CLASS.top)).toBeTruthy();
    expect(popoverContent.innerHTML).toBe('Hello');
  });

  it('should render text and left placement', () => {
    const containerPopover = renderPopover({
      children: 'Hello',
      target: 'btn',
      placement: 'left',
    });
    const popover = containerPopover.querySelector('.popover');
    const popoverContent = containerPopover.querySelector('.popover .popover-body');
    expect(popover.className.includes(POPOVER_POSITION_CLASS.left)).toBeTruthy();
    expect(popoverContent.innerHTML).toBe('Hello');
  });

  it('should throw error when there is no target', () => {
    try {
      renderPopover();
    } catch (error) {
      expect(error.message).toBe('Need target!');
    }
  });
});
