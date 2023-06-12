import FormText from '../FormText.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('FormText', () => {
  test('should render correctly', () => {
    const { container } = render(FormText);
    const formtext = container.querySelector('.form-text');
    expect(formtext.className).toContain('form-text');
  });

  test('should render custom color', () => {
    const { container } = render(FormText, { props: { color: 'indigo' } });
    const formtext = container.querySelector('.form-text');
    expect(formtext.className).toContain('form-text');
    expect(formtext.className).toContain('text-indigo');
  });

  test('should render custom class', () => {
    const { container } = render(FormText, { props: { class: 'coffee' } });
    const formtext = container.querySelector('.form-text');
    expect(formtext.className).toContain('coffee');
  });
});
