const defaultToggleEvents = ['touchstart', 'click'];

export default (toggler, togglerFn) => {
  let unbindEvents;

  if (
    typeof toggler === 'string' &&
    typeof window !== 'undefined' &&
    document &&
    document.createElement
  ) {
    let selection = document.querySelectorAll(toggler);
    if (!selection.length) {
      selection = document.querySelectorAll(`#${toggler}`);
    }
    if (!selection.length) {
      throw new Error(
        `The target '${toggler}' could not be identified in the dom, tip: check spelling`
      );
    }

    defaultToggleEvents.forEach((event) => {
      selection.forEach((element) => {
        element.addEventListener(event, togglerFn);
      });
    });

    unbindEvents = () => {
      defaultToggleEvents.forEach((event) => {
        selection.forEach((element) => {
          element.removeEventListener(event, togglerFn);
        });
      });
    };
  }

  return () => {
    if (typeof unbindEvents === 'function') {
      unbindEvents();
      unbindEvents = undefined;
    }
  }
};
