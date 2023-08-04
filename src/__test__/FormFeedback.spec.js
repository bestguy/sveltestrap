import FormFeedback from '../FormFeedback.svelte';
import { render, cleanup } from '@testing-library/svelte';

beforeEach(cleanup);

describe('FormFeedback', () => {
  test('should render correctly', () => {
    const { container } = render(FormFeedback);
    const formfeedback = container.querySelector('.invalid-feedback');
    expect(formfeedback.className).toContain('invalid-feedback');
  });

  test('should render valid feedback', () => {
    const { container } = render(FormFeedback, { props: { valid: true } });
    const formfeedback = container.querySelector('.valid-feedback');
    expect(formfeedback.className).toContain('valid-feedback');
  });
  test('should render invalid tooltip', () => {
    const { container } = render(FormFeedback, { props: { tooltip: true } });
    const formfeedback = container.querySelector('.invalid-tooltip');
    expect(formfeedback.className).toContain('invalid-tooltip');
  });
  test('should render valid tooltip', () => {
    const { container } = render(FormFeedback, {
      props: { tooltip: true, valid: true }
    });
    const formfeedback = container.querySelector('.valid-tooltip');
    expect(formfeedback.className).toContain('valid-tooltip');
  });
});
