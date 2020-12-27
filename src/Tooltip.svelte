<script>
  // import classnames from './utils';
  let className = '';
  // export { className as class };
  export let target = '';

  const tooltip = document.querySelector('#tooltip');
  // createPopper(target, tooltip, {
  //   placement: 'top',
  // })
</script>


<div id="tooltip" class="tooltip fade bs-tooltip-top show" role="tooltip" x-placement="top">
  <div class="arrow"></div>
  <div class="tooltip-inner">Hello</div>
</div>
