import { getTransitionDuration } from './utils';

export function collapseOut(node) {
  node.style.height = `${node.getBoundingClientRect().height}px`;
  node.classList.add('collapsing');
  node.classList.remove('collapse', 'show');
  const duration = getTransitionDuration(node);

  return {
    duration,
    tick: t => {
      if (t > 0) {
        node.style.height = '';
      } else if (t === 0) {
        node.classList.remove('collapsing');
        node.classList.add('collapse');
      }
    }
  }
}

export function collapseIn(node) {
  node.classList.add('collapsing');
  node.classList.remove('collapse', 'show');
  node.style.height = 0;
  const duration = getTransitionDuration(node);

  return {
    duration,
    tick: t => {
      if (t < 1) {
        node.style.height = `${node.scrollHeight}px`;
      } else {
        node.classList.remove('collapsing');
        node.classList.add('collapse', 'show');
        node.style.height = '';
      }
    }
  }
}