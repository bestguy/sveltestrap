<script>
  import { TabContent, TabPane } from 'sveltestrap';

  let status = 'alpha';
</script>

<h5>Current state: {status}</h5>
<TabContent on:tab={(e) => (status = e.detail)}>
  <TabPane tabId="alpha" tab="Alpha" active>
    <h2>Alpha</h2>
  </TabPane>
  <TabPane tabId="bravo" tab="Bravo">
    <h2>Bravo</h2>
  </TabPane>
  <TabPane tabId="charlie" tab="Charlie">
    <h2>Charlie</h2>
  </TabPane>
</TabContent>
