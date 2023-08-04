import InputGroupText from '../InputGroupText.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('InputGroupText', () => {
  test('should render correctly', () => {
    const { container } = render(InputGroupText);
    const inputgrouptext = container.querySelector('.input-group-text');
    expect(inputgrouptext.className).toContain('input-group-text');
  });
  test('should render custom class', () => {
    const { container } = render(InputGroupText, { props: { class: 'mucho' } });
    const inputgrouptext = container.querySelector('.input-group-text');
    expect(inputgrouptext.className).toContain('mucho');
  });
});
