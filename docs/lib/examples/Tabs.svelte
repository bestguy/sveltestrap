<script>
	import clsx from 'clsx';

	import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'sveltestrap';

	let activeTab = '1';

	$: tab1Classes = clsx({ active: activeTab === '1' });
	$: tab2Classes = clsx({ active: activeTab === '2' });
</script>

<Nav tabs>
	<NavItem>
		<NavLink
			class="{tab1Classes}"
			on:click="{() => activeTab = '1'}"
		>
			Tab1
		</NavLink>
	</NavItem>
	<NavItem>
		<NavLink
			class="{tab2Classes}"
			on:click="{() => activeTab = '2'}"
		>
			Moar Tabs
		</NavLink>
	</NavItem>
</Nav>
<TabContent {activeTab}>
	<TabPane tabId="1">
		<Row>
			<Col sm="12">
			<h4>Tab 1 Contents</h4>
			</Col>
		</Row>
	</TabPane>
	<TabPane tabId="2">
		<Row>
			<Col sm="6">
			<Card body>
				<CardTitle>Special Title Treatment</CardTitle>
				<CardText>With supporting text below as a natural lead-in to additional content.</CardText>
				<Button>Go somewhere</Button>
			</Card>
			</Col>
			<Col sm="6">
			<Card body>
				<CardTitle>Special Title Treatment</CardTitle>
				<CardText>With supporting text below as a natural lead-in to additional content.</CardText>
				<Button>Go somewhere</Button>
			</Card>
			</Col>
		</Row>
	</TabPane>
</TabContent>
