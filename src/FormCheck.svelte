<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let size = '';
  export let checked = false;
  export let disabled = false;
  export let group = undefined;
  export let id = undefined;
  export let inline = false;
  export let invalid = false;
  export let label = '';
  export let name = '';
  export let type = 'checkbox';
  export let valid = false;
  export let value = undefined;

  $: classes = classnames(
    className,
    'form-check',
    {
      'form-switch': (type === 'switch'),
      'form-check-inline': inline,
      [`form-control-${size}`]: size
    }
  );

  $: inputClasses = classnames(
    'form-check-input',
    {
      'is-invalid': invalid,
      'is-valid' : valid
    });
  $: idFor = id || label;
</script>

<div class={classes}>
  {#if type === 'radio'}
    <input
      {...$$restProps}
      class={inputClasses}
      id={idFor}
      type="radio"
      on:blur
      on:change
      on:focus
      on:input
      bind:group
      {disabled}
      {name}
      {value} />
  {:else if type === 'switch'}
    <input
      {...$$restProps}
      class={inputClasses}
      id={idFor}
      type="checkbox"
      on:blur
      on:change
      on:focus
      on:input
      bind:checked
      {disabled}
      {name}
      {value} />
  {:else}
    <input
      {...$$restProps}
      class={inputClasses}
      id={idFor}
      type="checkbox"
      on:blur
      on:change
      on:focus
      on:input
      bind:checked
      {disabled}
      {name}
      {value} />
  {/if}
  {#if label}
    <label
      class='form-check-label'
      for={idFor}>
      <slot name="label">{label}</slot>
    </label>
  {/if}
</div>
