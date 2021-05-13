<script>
  import { TabContent, TabPane } from 'sveltestrap';
</script>

<TabContent vertical pills activeTab="alpha">
  <TabPane tabId="alpha" tab="Alpha">
    <h2>Alpha</h2>
    <img
      alt="Alpha Flight"
      src="https://upload.wikimedia.org/wikipedia/en/4/49/Alpha_Flight_cast_picture_%28John_Byrne_era%29.gif">
  </TabPane>
  <TabPane tabId="bravo" tab="Bravo">
    <h2>Bravo</h2>
    <img
      alt="Johnny Bravo"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Johnny_Bravo_series_logo.png/320px-Johnny_Bravo_series_logo.png">
  </TabPane>
  <TabPane tabId="charlie" tab="Charlie">
    <h2>Charlie</h2>
    <img
      alt="Charlie Brown"
      src="https://upload.wikimedia.org/wikipedia/en/2/22/Charlie_Brown.png">
  </TabPane>
</TabContent>
