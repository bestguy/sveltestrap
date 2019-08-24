<script>
  import { Col, Row } from 'sveltestrap';
  import PrismCode from '../PrismCode.svelte';
  import Example from '../Example.svelte';
  import Badge from './Badge.svelte';
  import BadgeButton from './BadgeButton.svelte';
  import BadgeLinks from './BadgeLinks.svelte';
  import Colors from './Colors.svelte';
  import Pills from './Pills.svelte';
  import badgeButtonSource from '!!raw-loader!./BadgeButton.svelte';
  import badgeSource from '!!raw-loader!./Badge.svelte';
  import badgeLinksSource from '!!raw-loader!./BadgeLinks.svelte';
  import colorsSource from '!!raw-loader!./Colors.svelte';
  import pillsSource from '!!raw-loader!./Pills.svelte';
</script>

<h1>Badges</h1>
<a href="https://getbootstrap.com/docs/4.3/components/badges/" target="_blank">
  Bootstrap Badges
</a>

<Example source={badgeSource}>
  <p slot="info">
    Badges scale to parent.
  </p>
  <Badge />
</Example>

<Example source={badgeButtonSource}>
  <p slot="info">
    Badges can be used as part of links or buttons to provide a counter.
  </p>
  <BadgeButton />
</Example>

<Example title="Colors" source={colorsSource}>
  <Colors />
</Example>

<Example title="Pills" source={pillsSource}>
  <Pills />
</Example>

<Example title="Links" source={badgeLinksSource}>
  <p slot="info">
    Adding the href prop will default the badge to a link.
  </p>
  <BadgeLinks />
</Example>
