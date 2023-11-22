declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'x'?: (event: any) => any;
    'x-placement'?: any;
    disabled?: any;
    active?: any;
    readonly?: any;
    invalid?: any;
    valid?: any;
    click?: any;
  }
}