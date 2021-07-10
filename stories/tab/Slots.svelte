<script>
  import { Icon, TabContent, TabPane } from 'sveltestrap';
</script>

<TabContent>
  <TabPane tabId="alpha" active>
    <span slot="tab">
      Alpha <Icon name="gear" />
    </span>
    <img
      alt="Alpha Flight"
      src="https://upload.wikimedia.org/wikipedia/en/4/49/Alpha_Flight_cast_picture_%28John_Byrne_era%29.gif"
    />
  </TabPane>
  <TabPane tabId="bravo">
    <span slot="tab">
      Bravo <Icon name="hand-thumbs-up" />
    </span>
    <img
      alt="Johnny Bravo"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Johnny_Bravo_series_logo.png/320px-Johnny_Bravo_series_logo.png"
    />
  </TabPane>
  <TabPane tabId="charlie">
    <span slot="tab">
      Charlie <Icon name="alarm" />
    </span>
    <img
      alt="Charlie Brown"
      src="https://upload.wikimedia.org/wikipedia/en/2/22/Charlie_Brown.png"
    />
  </TabPane>
</TabContent>
