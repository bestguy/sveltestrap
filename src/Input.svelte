<script>
  import clsx from 'clsx';
  import { clean } from './utils';

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
  export let readonly;
  export let multiple = false;
  export let id = '';
  export let name = '';
  export let placeholder = '';
  export let disabled = false;

  const { type: _omitType, ...props } = clean($$props);

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
    <input {...props} {id} type="text" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'password'}
    <input {...props} {id} type="password" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'email'}
    <input {...props} {id} type="email" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'file'}
    <input {...props} {id} type="file" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'checkbox'}
    <input {...props} {id} type="checkbox" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'radio'}
    <input {...props} {id} type="radio" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'url'}
    <input {...props} {id} type="url" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'number'}
    <input {...props} {id} type="number" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'date'}
    <input {...props} {id} type="date" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'time'}
    <input {...props} {id} type="time" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'datetime'}
    <input {...props} {id} type="datetime" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'color'}
    <input {...props} {id} type="color" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {:else if type === 'search'}
    <input {...props} {id} type="search" bind:value {readonly} class="{classes}" {name} {disabled} {placeholder} />
  {/if}

{:else if tag === 'textarea'}

  <textarea {...props} {id} class="{classes}" bind:value {name} {disabled}></textarea>

{:else if tag === 'select'}

  <select {...props} {id} {multiple} class="{classes}" {name} {disabled}>
    <slot />
  </select>

{/if}
