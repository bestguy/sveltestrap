<script>
  import classnames from './utils';

  let className = '';
  export { className as class };

  export let type = 'text';
  export let size = undefined;
  export let bsSize = undefined;
  export let color = undefined;
  export let checked = false;
  export let valid = false;
  export let invalid = false;
  export let plaintext = false;
  export let addon = false;
  export let value = '';
  export let files = '';
  export let readonly;
  export let multiple = false;
  export let name = '';
  export let placeholder = '';
  export let disabled = false;

  let classes;
  let tag;
  $: {
    const checkInput = ['radio', 'checkbox'].indexOf(type) > -1;
    const isNotaNumber = new RegExp('\\D', 'g');

    const fileInput = type === 'file';
    const textareaInput = type === 'textarea';
    const rangeInput = type === 'range';
    const selectInput = type === 'select';
    const buttonInput =
      type === 'button' || type === 'reset' || type === 'submit';
    const unsupportedInput = type === 'hidden' || type === 'image';
    tag = selectInput || textareaInput ? type : 'input';

    let formControlClass = 'form-control';

    if (plaintext) {
      formControlClass = `${formControlClass}-plaintext`;
      tag = 'input';
    } else if (fileInput) {
      formControlClass = `${formControlClass}-file`;
    } else if (checkInput) {
      if (addon) {
        formControlClass = null;
      } else {
        formControlClass = 'form-check-input';
      }
    } else if (buttonInput) {
      formControlClass = `btn btn-${color || 'secondary'}`;
    } else if (rangeInput) {
      formControlClass = 'form-control-range';
    } else if (unsupportedInput) {
      formControlClass = '';
    }

    if (size && isNotaNumber.test(size)) {
      console.warn(
        'Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.'
      );
      bsSize = size;
      size = undefined;
    }

    classes = classnames(
      className,
      invalid && 'is-invalid',
      valid && 'is-valid',
      bsSize ? `form-control-${bsSize}` : false,
      formControlClass
    );
  }

  const handleInput = (event) => {
    value = event.target.value;
  };
</script>

{#if tag === 'input'}
  {#if type === 'text'}
    <input
      {...$$restProps}
      type="text"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'password'}
    <input
      {...$$restProps}
      type="password"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'email'}
    <input
      {...$$restProps}
      type="email"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'file'}
    <input
      {...$$restProps}
      type="file"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:files
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'checkbox'}
    <input
      {...$$restProps}
      type="checkbox"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:checked
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'radio'}
    <input
      {...$$restProps}
      type="radio"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'url'}
    <input
      {...$$restProps}
      type="url"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'number'}
    <input
      {...$$restProps}
      type="number"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'date'}
    <input
      {...$$restProps}
      type="date"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'time'}
    <input
      {...$$restProps}
      type="time"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'datetime'}
    <input
      {...$$restProps}
      type="datetime"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'color'}
    <input
      {...$$restProps}
      type="color"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'range'}
    <input
      {...$$restProps}
      type="range"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else if type === 'search'}
    <input
      {...$$restProps}
      type="search"
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:change
      on:input
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder} />
  {:else}
    <input
      {...$$restProps}
      {type}
      on:blur
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:input={handleInput}
      on:change={handleInput}
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder}
      {value} />
  {/if}
{:else if tag === 'textarea'}
  <textarea
    {...$$restProps}
    class={classes}
    on:blur
    on:focus
    on:keydown
    on:keypress
    on:keyup
    on:change
    on:input
    bind:value
    {name}
    {disabled} />
{:else if tag === 'select' && !multiple}
  <select
    {...$$restProps}
    class={classes}
    on:blur
    on:focus
    on:change
    on:input
    bind:value
    {name}
    {disabled}>
    <slot />
  </select>

  <!-- {:else if tag === 'select' && multiple}
  <select
    {...$$restProps}
    multiple
    class={classes}
    on:blur
    on:focus
    on:change
    on:input
    bind:value
    {name}
    {disabled}>
    <slot />
  </select> -->
{/if}
