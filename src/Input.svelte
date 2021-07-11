<script>
  import FormCheck from './FormCheck.svelte';

  import classnames from './utils';

  let className = '';
  export { className as class };

  export let bsSize = undefined;
  export let checked = false;
  export let color = undefined;
  export let disabled = undefined;
  export let files = undefined;
  export let group = undefined;
  export let invalid = false;
  export let label = undefined;
  export let multiple = undefined;
  export let name = '';
  export let placeholder = '';
  export let plaintext = false;
  export let readonly = undefined;
  export let size = undefined;
  export let type = 'text';
  export let valid = false;
  export let value = '';

  let classes;
  let tag;
  $: {
    const isNotaNumber = new RegExp('\\D', 'g');

    let isBtn = false;
    let formControlClass = 'form-control';
    tag = 'input';

    switch (type) {
      case 'color':
        formControlClass = `form-control form-control-color`;
        break;
      case 'range':
        formControlClass = 'form-range';
        break;
      case 'select':
        formControlClass = `form-select`;
        tag = 'select';
        break;
      case 'textarea':
        tag = 'textarea';
        break;
      case 'button':
      case 'reset':
      case 'submit':
        formControlClass = `btn btn-${color || 'secondary'}`;
        isBtn = true;
        break;
      case 'hidden':
      case 'image':
        formControlClass = undefined;
        break;
      default:
        formControlClass = 'form-control';
        tag = 'input';
    }
    if (plaintext) {
      formControlClass = `${formControlClass}-plaintext`;
      tag = 'input';
    }

    if (size && isNotaNumber.test(size)) {
      console.warn(
        'Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.'
      );
      bsSize = size;
      size = undefined;
    }

    classes = classnames(className, formControlClass, {
      'is-invalid': invalid,
      'is-valid': valid,
      [`form-control-${bsSize}`]: bsSize && !isBtn,
      [`btn-${bsSize}`]: bsSize && isBtn
    });
  }

  const handleInput = (event) => {
    value = event.target.value;
  };
</script>

{#if tag === 'input'}
  {#if type === 'text'}
    <input
      {...$$restProps}
      class={classes}
      type="text"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {disabled}
      {name}
      {placeholder}
      {readonly}
    />
  {:else if type === 'password'}
    <input
      {...$$restProps}
      class={classes}
      type="password"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {disabled}
      {name}
      {placeholder}
      {readonly}
    />
  {:else if type === 'color'}
    <input
      {...$$restProps}
      class={classes}
      type="color"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {disabled}
      {name}
      {placeholder}
      {readonly}
    />
  {:else if type === 'email'}
    <input
      {...$$restProps}
      class={classes}
      type="email"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {disabled}
      {name}
      {placeholder}
      {readonly}
    />
  {:else if type === 'file'}
    <input
      {...$$restProps}
      class={classes}
      type="file"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:files
      bind:value
      {disabled}
      {invalid}
      {multiple}
      {name}
      {placeholder}
      {readonly}
      {valid}
    />
  {:else if type === 'checkbox' || type === 'radio' || type === 'switch'}
    <FormCheck
      {...$$restProps}
      class={className}
      size={bsSize}
      {type}
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:checked
      bind:group
      bind:value
      {disabled}
      {invalid}
      {label}
      {name}
      {placeholder}
      {readonly}
      {valid}
    />
  {:else if type === 'url'}
    <input
      {...$$restProps}
      class={classes}
      type="url"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {disabled}
      {name}
      {placeholder}
      {readonly}
    />
  {:else if type === 'number'}
    <input
      {...$$restProps}
      class={classes}
      type="number"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {readonly}
      {name}
      {disabled}
      {placeholder}
    />
  {:else if type === 'date'}
    <input
      {...$$restProps}
      class={classes}
      type="date"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {disabled}
      {name}
      {placeholder}
      {readonly}
    />
  {:else if type === 'time'}
    <input
      {...$$restProps}
      class={classes}
      type="time"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {disabled}
      {name}
      {placeholder}
      {readonly}
    />
  {:else if type === 'datetime'}
    <input
      {...$$restProps}
      type="datetime"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder}
    />
  {:else if type === 'color'}
    <input
      {...$$restProps}
      type="color"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder}
    />
  {:else if type === 'range'}
    <input
      {...$$restProps}
      type="range"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder}
    />
  {:else if type === 'search'}
    <input
      {...$$restProps}
      type="search"
      on:blur
      on:change
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      bind:value
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder}
    />
  {:else}
    <input
      {...$$restProps}
      {type}
      on:blur
      on:change={handleInput}
      on:focus
      on:input={handleInput}
      on:keydown
      on:keypress
      on:keyup
      {readonly}
      class={classes}
      {name}
      {disabled}
      {placeholder}
      {value}
    />
  {/if}
{:else if tag === 'textarea'}
  <textarea
    {...$$restProps}
    class={classes}
    on:blur
    on:change
    on:focus
    on:input
    on:keydown
    on:keypress
    on:keyup
    bind:value
    {disabled}
    {name}
    {placeholder}
    {readonly}
  />
{:else if tag === 'select' && !multiple}
  <select
    {...$$restProps}
    class={classes}
    on:blur
    on:change
    on:focus
    on:input
    bind:value
    {name}
    {disabled}
    {readonly}
  >
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
