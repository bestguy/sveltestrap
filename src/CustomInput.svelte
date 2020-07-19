<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let name = '';
  export let id = '';
  export let type;
  export let label = '';
  export let checked = false;
  export let disabled = false;
  export let inline = false;
  export let valid = false;
  export let value = '';
  export let invalid = false;
  export let bsSize = '';
  export let placeholder = '';
  export let htmlFor = '';
  export { htmlFor as for };

  $: customClass = classnames(
    className,
    `custom-${type}`,
    bsSize ? `custom-${type}-${bsSize}` : false
  );

  $: validationClassNames = classnames(
    invalid && 'is-invalid',
    valid && 'is-valid'
  );

  $: combinedClasses = classnames(customClass, validationClassNames);

  $: fileClasses = classnames(validationClassNames, 'custom-file-input');

  $: wrapperClasses = classnames(customClass, 'custom-control', {
    'custom-control-inline': inline
  });

  $: customControlClasses = classnames(
    validationClassNames,
    'custom-control-input'
  );

  $: labelHtmlFor = htmlFor || id;
</script>

{#if type === 'select'}
  <select
    {...$$restProps}
    {id}
    class={combinedClasses}
    on:blur
    on:focus
    on:change
    on:input
    bind:value
    {name}
    {disabled}
    {placeholder}>
    <slot />
  </select>
{:else if type === 'file'}
  <div class={customClass}>
    <input
      {...$$restProps}
      {id}
      type="file"
      class={fileClasses}
      on:blur
      on:focus
      on:change
      on:input
      {name}
      {disabled}
      {placeholder} />
    <label class="custom-file-label" for={labelHtmlFor}>
      {label || 'Choose file'}
    </label>
  </div>
{:else if type === 'switch' || type === 'checkbox'}
  <div class={wrapperClasses}>
    <input
      {...$$restProps}
      {id}
      type="checkbox"
      class={customControlClasses}
      bind:checked
      {name}
      {disabled}
      {placeholder} />
    <label class="custom-control-label" for={labelHtmlFor}>{label}</label>
    <slot />
  </div>
{:else if type === 'radio'}
  <div class={wrapperClasses}>
    <input
      {...$$restProps}
      {id}
      type="radio"
      class={customControlClasses}
      {name}
      {disabled}
      {placeholder} />
    <label class="custom-control-label" for={labelHtmlFor}>{label}</label>
    <slot />
  </div>
{:else}
  <input
    {...$$restProps}
    {type}
    {id}
    class={combinedClasses}
    on:blur
    on:focus
    on:change
    on:input
    {name}
    {disabled}
    {placeholder} />
{/if}
