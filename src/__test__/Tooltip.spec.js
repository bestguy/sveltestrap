import Tooltip from '../Tooltip.svelte';
import Button from '../Button.svelte';
import { render, cleanup } from '@testing-library/svelte';

const renderTooltip = (props) => {
  const { container } = render(Tooltip, { props });
  return container;
};
const renderButton = (props) => {
  const { container } = render(Button, { props });
  container.id = 'btn';
  return container;
};

beforeEach(() => {
  cleanup();
  renderButton({ children: 'Hello' });
});

const TOOLTIP_POSTION_CLASS = {
  top: 'bs-tooltip-top',
  bottom: 'bs-tooltip-bottom',
  left: 'bs-tooltip-left',
  right: 'bs-tooltip-right'
};

describe('Tooltip', () => {
  it('should render text and default placement(top)', () => {
    const containerTooltip = renderTooltip({
      children: 'Hello world!',
      target: 'btn',
      debugHover: true
    });
    const tooltip = containerTooltip.querySelector('.tooltip');
    const tooltipInner = containerTooltip.querySelector('.tooltip-inner');
    expect(tooltip.className.includes(TOOLTIP_POSTION_CLASS.top)).toBeTruthy();
    expect(tooltipInner.innerHTML).toBe('Hello world!');
  });

  it('should render text and left placement', () => {
    const containerTooltip = renderTooltip({
      children: 'Hello world!',
      placement: 'left',
      target: 'btn',
      debugHover: true
    });
    const tooltip = containerTooltip.querySelector('.tooltip');
    const tooltipInner = containerTooltip.querySelector('.tooltip-inner');
    expect(tooltip.className.includes(TOOLTIP_POSTION_CLASS.left)).toBeTruthy();
    expect(tooltipInner.innerHTML).toBe('Hello world!');
  });

  it('should throw error when there is no target', () => {
    try{
      renderTooltip();
    } catch(error) {
      expect(error.message).toBe('Need target!');
    }
  });
});
