<script>
  import classnames from './utils';
  import toNumber from 'lodash.tonumber';

  let className = '';
  export { className as class };
  export let bar = false;
  export let multi = false;
  export let value = 0;
  export let max = 100;
  export let animated = false;
  export let striped = false;
  export let color = '';
  export let barClassName = '';

  $: classes = classnames(className, 'progress');

  $: progressBarClasses = classnames(
    'progress-bar',
    bar ? className || barClassName : barClassName,
    animated ? 'progress-bar-animated' : null,
    color ? `bg-${color}` : null,
    striped || animated ? 'progress-bar-striped' : null
  );

  $: percent = (toNumber(value) / toNumber(max)) * 100;
</script>

{#if bar}
  {#if multi}
    <slot />
  {:else}
    <div
      {...$$restProps}
      class={progressBarClasses}
      style="width: {percent}%"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax={max}>
      <slot />
    </div>
  {/if}
{:else}
  <div {...$$restProps} class={classes}>
    {#if multi}
      <slot />
    {:else}
      <div
        class={progressBarClasses}
        style="width: {percent}%"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax={max}>
        <slot />
      </div>
    {/if}
  </div>
{/if}
