import { getTransitionDuration } from './utils';

export function backdropIn(node) {
  node.style.display = 'block';

  const duration = getTransitionDuration(node);

  return {
    duration,
    tick: (t) => {
      if (t === 0) {
        node.classList.add('show');
      }
    }
  };
}

export function backdropOut(node) {
  node.classList.remove('show');
  const duration = getTransitionDuration(node);

  return {
    duration,
    tick: (t) => {
      if (t === 0) {
        node.style.display = 'none';
      }
    }
  };
}

export function collapseOut(node, params) {
  const dimension = params.horizontal ? 'width' : 'height';
  node.style[dimension] = `${node.getBoundingClientRect()[dimension]}px`;
  node.classList.add('collapsing');
  node.classList.remove('collapse', 'show');
  const duration = getTransitionDuration(node);

  return {
    duration,
    tick: (t) => {
      if (t > 0) {
        node.style[dimension] = '';
      } else if (t === 0) {
        node.classList.remove('collapsing');
        node.classList.add('collapse');
      }
    }
  };
}

export function collapseIn(node, params) {
  const horizontal = params.horizontal;
  const dimension = horizontal ? 'width' : 'height';
  node.classList.add('collapsing');
  node.classList.remove('collapse', 'show');
  node.style[dimension] = 0;
  const duration = getTransitionDuration(node);

  return {
    duration,
    tick: (t) => {
      if (t < 1) {
        if (horizontal) {
          node.style.width = `${node.scrollWidth}px`;
        } else {
          node.style.height = `${node.scrollHeight}px`;
        }
      } else {
        node.classList.remove('collapsing');
        node.classList.add('collapse', 'show');
        node.style[dimension] = '';
      }
    }
  };
}

export function modalIn(node) {
  node.style.display = 'block';
  const duration = getTransitionDuration(node);
  console.log('SVELTESTRAP@MODAL:modalIn', { node });
  return {
    duration,
    tick: (t) => {
      console.log('SVELTESTRAP@MODAL:modalIn-t>0', { node });
      if (t > 0) {
        node.classList.add('show');
      }
    }
  };
}

export function modalOut(node) {
  node.classList.remove('show');
  const duration = getTransitionDuration(node);

  return {
    duration,
    tick: (t) => {
      if (t === 1) {
        node.style.display = 'none';
      }
    }
  };
}
