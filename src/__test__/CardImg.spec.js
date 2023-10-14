import CardImg from '../CardImg.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('CardImg', () => {
  test('should render correctly', () => {
    const { container } = render(CardImg, {props:{src:""}});
    const component = container.querySelector('.card-img');
    expect(component.className).toBe('card-img');
  });

  test('should render custom class', () => {
    const { container } = render(CardImg, { props: { src: '', class: 'boogie' } });
    const component = container.querySelector('.card-img');
    expect(component.className).toBe('boogie card-img');
  });

  test('should render prop top', () => {
    const { container } = render(CardImg, { props: { src: '', top: true } });
    const component = container.querySelector('.card-img-top');
    expect(component.className).toContain('card-img-top');
  });

  test('should render prop bottom', () => {
    const { container } = render(CardImg, { props: { src: '', bottom: true } });
    const component = container.querySelector('.card-img-bottom');
    expect(component.className).toContain('card-img-bottom');
  });

  test('should render src', () => {
    const { getByAltText } = render(CardImg, {
      props: { src: 'http://example.com/example.png', alt: 'perfect picture' }
    });
    const image = getByAltText('perfect picture');
    expect(image.src).toBe('http://example.com/example.png');
  });
});
