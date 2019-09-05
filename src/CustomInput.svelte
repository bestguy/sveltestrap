<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let name = '';
  export let id = '';
  export let type;
  export let label = '';
  export let disabled = false;
  export let inline = false;
  export let valid = false;
  export let invalid = false;
  export let multiple = false;
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
  <select {...props} {id} class="{combinedClasses}" {name} {disabled} {placeholder} {multiple}>
    <slot />
  </select>
{:else if type === 'file'}
  <div class="{customClass}">
    <input {id} type="file" class="{fileClasses}" {name} {disabled} {placeholder} />
    <label {...props} class="custom-file-label" for="{labelHtmlFor}">{label || 'Choose file'}</label>
  </div>
{:else if type !== 'checkbox' && type !== 'radio' && type !== 'switch'}
  <input {...props} {type} {id} class="{combinedClasses}" {name} {disabled} {placeholder} />
{:else}
  <div {...props} class="{wrapperClasses}">
    <input {id} type="{type === 'switch' ? 'checkbox' : type}" class="{customControlClasses}" {name} {disabled} {placeholder} />
    <label class="custom-control-label" for="{labelHtmlFor}">{label}</label>
    <slot />
  </div>
{/if}

