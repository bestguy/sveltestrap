export function getOriginalBodyPadding() {
	const style = window.getComputedStyle(document.body, null);

	return parseInt((style && style.getPropertyValue('padding-right')) || 0, 10);
}

export function getScrollbarWidth() {
	let scrollDiv = document.createElement('div');
	// .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113
	scrollDiv.style.position = 'absolute';
	scrollDiv.style.top = '-9999px';
	scrollDiv.style.width = '50px';
	scrollDiv.style.height = '50px';
	scrollDiv.style.overflow = 'scroll';
	document.body.appendChild(scrollDiv);
	const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	document.body.removeChild(scrollDiv);
	return scrollbarWidth;
}

export function setScrollbarWidth(padding) {
	document.body.style.paddingRight = padding > 0 ? `${padding}px` : null;
}

export function isBodyOverflowing() {
	return document.body.clientWidth < window.innerWidth;
}

export function conditionallyUpdateScrollbar() {
	const scrollbarWidth = getScrollbarWidth();
	// https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/js/src/modal.js#L433
	const fixedContent = document.querySelectorAll(
		'.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
	)[0];
	const bodyPadding = fixedContent
		? parseInt(fixedContent.style.paddingRight || 0, 10)
		: 0;

	if (isBodyOverflowing()) {
		setScrollbarWidth(bodyPadding + scrollbarWidth);
	}
}

export function getColumnSizeClass(isXs, colWidth, colSize) {
	if (colSize === true || colSize === '') {
		return isXs ? 'col' : `col-${colWidth}`;
	} else if (colSize === 'auto') {
		return isXs ? 'col-auto' : `col-${colWidth}-auto`;
	}

	return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
}
