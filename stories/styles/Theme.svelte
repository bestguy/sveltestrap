<script>
  import { Button, Icon, Styles } from 'sveltestrap';

  let theme = 'light';
</script>

<Styles {theme} />

<Button
  color="primary"
  outline
  active={theme === 'light'}
  on:click={() => (theme = 'light')}
>
  light <Icon name="sun-fill" />
</Button>
<Button
  color="primary"
  outline
  active={theme === 'dark'}
  on:click={() => (theme = 'dark')}
>
  dark <Icon name="moon-stars-fill" />
</Button>
<Button
  color="primary"
  outline
  active={theme === 'auto'}
  on:click={() => (theme = 'auto')}
>
  auto <Icon name="circle-half" />
</Button>
