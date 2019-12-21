<script>
  import clsx from 'clsx';
  import { clean } from './utils';

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

  const { type: _omitType, ...props } = clean($$props);

  $: customClass = clsx(
    className,
    `custom-${type}`,
    bsSize ? `custom-${type}-${bsSize}` : false,
  );

  $: validationClassNames = clsx(
    invalid && 'is-invalid',
    valid && 'is-valid',
  );

  $: combinedClasses = clsx(
    customClass,
    validationClassNames,
  );

  $: fileClasses = clsx(
    validationClassNames,
    'custom-file-input',
  );

  $: wrapperClasses = clsx(
    customClass,
    'custom-control',
    { 'custom-control-inline': inline },
  );

  $: customControlClasses = clsx(
    validationClassNames,
    'custom-control-input',
  );

  $: labelHtmlFor = htmlFor || id;
</script>

{#if type === 'select'}
  <select {id} class="{combinedClasses}" on:blur on:focus on:change on:input bind:value {name} {disabled} {placeholder} {...props}>
    <slot />
  </select>
{:else if type === 'file'}
  <div class="{customClass}">
    <input {id} type="file" class="{fileClasses}" on:blur on:focus on:change on:input {name} {disabled} {placeholder} {...props} />
    <label class="custom-file-label" for="{labelHtmlFor}">{label || 'Choose file'}</label>
  </div>
{:else if type === 'switch' || type === 'checkbox'}
  <div class="{wrapperClasses}">
    <input {id} type="checkbox" class="{customControlClasses}" bind:checked {name} {disabled} {placeholder} {...props} />
    <label class="custom-control-label" for="{labelHtmlFor}">{label}</label>
    <slot />
  </div>
{:else if type === 'radio'}
  <div class="{wrapperClasses}">
    <input {id} type="radio" class="{customControlClasses}" {name} {disabled} {placeholder} {...props} />
    <label class="custom-control-label" for="{labelHtmlFor}">{label}</label>
    <slot />
  </div>
{:else}
  <input {type} {id} class="{combinedClasses}" on:blur on:focus on:change on:input {name} {disabled} {placeholder} {...props} />
{/if}

