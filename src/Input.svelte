<script>
  import clsx from 'clsx';

  let className = '';
    export { className as class };

  export let type = 'text';
  export let size = undefined;
  export let bsSize = undefined;
  export let valid = false;
  export let invalid = false;
  export let plaintext = false;
  export let addon = false;
  export let value = '';
  export let readonly = false;
  export let multiple = false;
  export let id = '';
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
    const selectInput = type === 'select';
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
    }

    if (size && isNotaNumber.test(size)) {
      console.warn('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.');
      bsSize = size;
      size = undefined;
    }

    classes = clsx(
      className,
      invalid && 'is-invalid',
      valid && 'is-valid',
      bsSize ? `form-control-${bsSize}` : false,
      formControlClass,
    );
  }
</script>
{#if tag === 'input'}
  {#if type === 'text'}
    <input {id} type="text" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'password'}
    <input {id} type="password" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'email'}
    <input {id} type="email" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'file'}
    <input {id} type="file" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'checkbox'}
    <input {id} type="checkbox" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'radio'}
    <input {id} type="radio" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'url'}
    <input {id} type="url" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'number'}
    <input {id} type="number" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'date'}
    <input {id} type="date" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'time'}
    <input {id} type="time" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'datetime'}
    <input {id} type="datetime" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'color'}
    <input {id} type="color" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'search'}
    <input {id} type="search" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {/if}

{:else if tag === 'textarea'}

  <textarea {id} class="{classes}" bind:value {name} {disabled}></textarea>

{:else if tag === 'select'}

  <select {id} {multiple} class="{classes}" {name} {disabled}>
    <slot />
  </select>

{/if}
