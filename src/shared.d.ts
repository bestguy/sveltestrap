/**
 * Valid Bootstrap colors
 */
export declare type Color =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

declare type BackgroundOnlyColor =
  | 'white'
  | 'transparent';

declare type TextOnlyColor =
  | 'body'
  | 'muted'
  | 'white'
  | 'black-50'
  | 'white-50';

export declare type BackgroundColor = Color | BackgroundOnlyColor;
export declare type TextColor = Color | TextOnlyColor;

export declare type Direction = 'up' | 'down' | 'left' | 'right' | 'start' | 'end';

type LocalSvelteProps = {
  children?: any;
  class?: string;
  [key: string]: any;
};

/**
 * Local svelte class for adding typescript definitions for svelte components
 *
 */
export declare class LocalSvelteComponent<Props = {}> {
  constructor(props: Props & LocalSvelteProps);
  $on<T = any>(
    event: string,
    callback: (event: CustomEvent<T>) => void
  ): () => void;
  $$prop_def: Props & LocalSvelteProps;
  render: undefined;
  context: undefined;
  setState: undefined;
  forceUpdate: undefined;
  props: undefined;
  state: undefined;
  refs: undefined;
}
