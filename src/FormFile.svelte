<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let size = '';
  export let disabled = false;
  export let files = undefined;
  export let id = undefined;
  export let invalid = false;
  export let label = '';
  export let multiple = false;
  export let name = '';
  export let placeholder = '';
  export let valid = false;
  export let value = ''; // TODO or restProps?

  $: customClass = classnames(
    className,
    'form-file',
    size ? `form-file-${size}` : false
  );

  $: inputClasses = classnames(
    'form-file-input',
    {
      'is-invalid': invalid,
      'is-valid' : valid
    });
  
  $: inputText = files ?
      [...files].map(file => file.name).join(', ')
      : placeholder || `Choose file${multiple ? 's' : ''}...`;
  // TODO readonly not working
</script>

<div class={customClass}>
  <input
    {...$$restProps}
    class={inputClasses}
    type="file"
    bind:files
    bind:value
    on:blur
    on:change
    on:focus
    on:input
    {disabled}
    {id}
    {multiple}
    {name}>
  <label class="form-file-label" for={id}>
    <span class="form-file-text">
      {inputText}
    </span>
    <span class="form-file-button">
      <slot name="label">{label || 'Browse'}</slot>
    </span>
  </label>
</div>
