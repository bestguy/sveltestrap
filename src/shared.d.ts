export declare type Breakpoints =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

  export declare type ContainerType =
  | 'body'
  | 'inline';

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

export declare type Direction = 'up' | 'down' | 'left' | 'right';
