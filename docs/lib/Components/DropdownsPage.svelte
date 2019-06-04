<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';
	import {
		Row,
		Col,
		Dropdown,
		DropdownToggle,
		DropdownItem,
		DropdownMenu,
	} from 'sveltestrap';

	import DropdownExample from '../examples/Dropdown';
	const DropdownExampleSource = require('!!raw-loader!../examples/Dropdown').default;

	import DropdownSizingExample from '../examples/DropdownSizing';

	import CustomDropdownExample from '../examples/CustomDropdown';
	const CustomDropdownExampleSource = require('!!raw-loader!../examples/CustomDropdown').default;

	import DropdownUncontrolledExample from '../examples/DropdownUncontrolled';
	const DropdownUncontrolledExampleSource = require('!!raw-loader!../examples/DropdownUncontrolled').default;

	import DropdownSetActiveFromChildExample from '../examples/DropdownSetActiveFromChild';
	const DropdownSetActiveFromChildSource = require('!!raw-loader!../examples/DropdownSetActiveFromChild').default;

	let example2Open = false;
	let ddDropup = false;
	let ddDropleft = false;
	let ddDropright = false;
</script>

<PageTitle title="Dropdowns" />
<p>
	The <code>Dropdown</code> component is used to pass the <code>isOpen</code> &amp; <code>toggle</code> props via context to the following components: <code>DropdownToggle</code>, <code>DropdownMenu</code>. The <code>DropdownToggle</code> uses the <code>Button</code> component internally, meaning it also accepts all the props the <a href="#components/buttons/">Button component</a> accepts. Unfortunately, the current implementation of the Context means that all dropdowns share the same context. So all dropdowns will open all other dropdowns.
</p>
<div class="docs-example">
	<DropdownExample />
</div>
<pre>
	<PrismCode class="language-html">
		{DropdownExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Alignment</SectionTitle>
<p>To align the <code>DropdownMenu</code> to the right, add a <code>right</code> prop to <code>Dropdown</code>.</p>
<div class="docs-example">
	<div style="display: inline-block;">
		<Dropdown isOpen={example2Open} toggle="{() => example2Open = !example2Open}">
			<DropdownToggle caret>
				Dropdown's menu is right-aligned
			</DropdownToggle>
			<DropdownMenu right>
				<DropdownItem header>Header</DropdownItem>
				<DropdownItem disabled>Action</DropdownItem>
				<DropdownItem>Another Action</DropdownItem>
				<DropdownItem divider />
				<DropdownItem>Another Really Really Long Action (Really!)</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	</div>
</div>
<pre>
	<PrismCode class="language-html">
{`<Dropdown isOpen={example2Open} toggle="{() => example2Open = !example2Open}">
	<DropdownToggle caret>
		Dropdown's menu is right-aligned
	</DropdownToggle>
	<DropdownMenu right>
		<DropdownItem header>Header</DropdownItem>
		<DropdownItem disabled>Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem divider />
		<DropdownItem>Another Really Really Long Action (Really!)</DropdownItem>
	</DropdownMenu>
</Dropdown>`}
	</PrismCode>
</pre>
<SectionTitle>Menu Headers</SectionTitle>
<pre>
	<PrismCode class="language-html">
{'<DropdownItem header>Header</DropdownItem>'}
	</PrismCode>
</pre>
<SectionTitle>Menu Dividers</SectionTitle>
<pre>
	<PrismCode class="language-html">
{'<DropdownItem divider/>'}
	</PrismCode>
</pre>
<SectionTitle>Menu Items</SectionTitle>
<pre>
	<PrismCode class="language-html">
{'<DropdownItem>Action</DropdownItem>'}
	</PrismCode>
</pre>
<SectionTitle>Disabled Menu Items</SectionTitle>
<pre>
	<PrismCode class="language-html">
{'<DropdownItem disabled>Action</DropdownItem>'}
	</PrismCode>
</pre>
<SectionTitle>Sizing</SectionTitle>
<div class="docs-example">
	<div>
		<DropdownSizingExample group size="lg" />
		<DropdownSizingExample class="mt-1" />
		<DropdownSizingExample class="mt-1" group size="sm" />
	</div>
</div>

<pre>
	<PrismCode class="language-html">
{`<Dropdown group {isOpen} size="lg" toggle="{() => isOpen = !isOpen}">
	<DropdownToggle caret>
		Dropdown
	</DropdownToggle>
	<DropdownMenu>
		...
	</DropdownMenu>
</Dropdown>

<Dropdown {isOpen} toggle="{() => isOpen = !isOpen}">
	<DropdownToggle caret>
		Dropdown
	</DropdownToggle>
	<DropdownMenu>
		...
	</DropdownMenu>
</Dropdown>

<Dropdown group {isOpen} size="sm" toggle="{() => isOpen = !isOpen}">
	<DropdownToggle caret>
		Dropdown
	</DropdownToggle>
	<DropdownMenu>
		...
	</DropdownMenu>
</Dropdown>`}
	</PrismCode>
</pre>
<h4>Custom Dropdown</h4>
<div class="docs-example">
	<CustomDropdownExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CustomDropdownExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Uncontrolled Dropdown</SectionTitle>
<p>
	For the most basic use-case an uncontrolled component can provide the functionality wanted without the need to manage/control the state of the component. <code>UncontrolledDropdown</code> does not require <code>isOpen</code> nor <code>toggle</code> props to work. For the <code>ButtonDropdown</code> flavor, an uncontrolled component have been made as well; <code>UncontrolledButtonDropdown</code>.
</p>
<div class="docs-example">
	<DropdownUncontrolledExample />
</div>
<pre>
	<PrismCode class="language-html">
		{DropdownUncontrolledExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Drop direction variations</SectionTitle>
<div class="docs-example">
	<Row>
		<Col>
			<Dropdown direction="up" isOpen={ddDropup} toggle="{() => ddDropup = !ddDropup}">
				<DropdownToggle caret>
					Dropup
				</DropdownToggle>
				<DropdownMenu>
					<DropdownItem>Another Action</DropdownItem>
					<DropdownItem>Another Action</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</Col>
		<Col>
			<Dropdown direction="left" isOpen={ddDropleft} toggle="{() => ddDropleft = !ddDropleft}">
				<DropdownToggle caret>
					Dropleft
				</DropdownToggle>
				<DropdownMenu>
					<DropdownItem>Another Action</DropdownItem>
					<DropdownItem>Another Action</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</Col>
		<Col>
			<Dropdown direction="right" isOpen={ddDropright} toggle="{() => ddDropright = !ddDropright}">
				<DropdownToggle caret>
					Dropright
				</DropdownToggle>
				<DropdownMenu>
					<DropdownItem>Another Action</DropdownItem>
					<DropdownItem>Another Action</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</Col>
	</Row>
</div>
<pre>
	<PrismCode class="language-html">
{`<Dropdown direction="up" isOpen={ddDropup} toggle="{() => ddDropup = !ddDropup}">
	<DropdownToggle caret>
		Dropup
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</Dropdown>

<Dropdown direction="left" isOpen={ddDropleft} toggle="{() => ddDropleft = !ddDropleft}">
	<DropdownToggle caret>
		Dropleft
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</Dropdown>

<Dropdown direction="right" isOpen={ddDropright} toggle="{() => ddDropright = !ddDropright}">
	<DropdownToggle caret>
		Dropright
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</Dropdown>`}
	</PrismCode>
</pre>

<!--<SectionTitle>Modifiers</SectionTitle>-->
<!--<div class="docs-example">-->
<!--	<Row>-->
<!--		<Col>-->
<!--		<Dropdown-->
<!--				isOpen={this.state.ddModifiers}-->
<!--				toggle={() => { this.setState({ ddModifiers: !this.state.ddModifiers }); }}-->
<!--		>-->
<!--		<DropdownToggle>-->
<!--			Dropdown-->
<!--		</DropdownToggle>-->
<!--		<DropdownMenu-->
<!--				modifiers={{-->
<!--				setMaxHeight: {-->
<!--				enabled: true,-->
<!--				order: 890,-->
<!--				fn: (data) => {-->
<!--								return {-->
<!--									...data,-->
<!--									styles: {-->
<!--										...data.styles,-->
<!--										overflow: 'auto',-->
<!--										maxHeight: '100px',-->
<!--									},-->
<!--								};-->
<!--							},-->
<!--			},-->
<!--			}}-->
<!--			>-->
<!--			<DropdownItem>Another Action</DropdownItem>-->
<!--			<DropdownItem>Another Action</DropdownItem>-->
<!--			<DropdownItem>Another Action</DropdownItem>-->
<!--			<DropdownItem>Another Action</DropdownItem>-->
<!--			<DropdownItem>Another Action</DropdownItem>-->
<!--			<DropdownItem>Another Action</DropdownItem>-->
<!--			<DropdownItem>Another Action</DropdownItem>-->
<!--			<DropdownItem>Another Action</DropdownItem>-->
<!--			<DropdownItem>Another Action</DropdownItem>-->
<!--			<DropdownItem>Another Action</DropdownItem>-->
<!--		</DropdownMenu>-->
<!--		</Dropdown>-->
<!--		</Col>-->
<!--	</Row>-->
<!--</div>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--{`<Dropdown isOpen={isOpen} toggle={toggle}>-->
<!--<DropdownToggle>-->
<!--Dropdown-->
<!--</DropdownToggle>-->
<!--<DropdownMenu-->
<!--modifiers={{-->
<!--setMaxHeight: {-->
<!--enabled: true,-->
<!--order: 890,-->
<!--fn: (data) => {-->
<!--	return {-->
<!--		...data,-->
<!--		styles: {-->
<!--			...data.styles,-->
<!--			overflow: 'auto',-->
<!--			maxHeight: 100,-->
<!--		},-->
<!--	};-->
<!--},-->
<!--},-->
<!--}}-->
<!--&gt;-->
<!--<DropdownItem>Another Action</DropdownItem>-->
<!--<DropdownItem>Another Action</DropdownItem>-->
<!--<DropdownItem>Another Action</DropdownItem>-->
<!--<DropdownItem>Another Action</DropdownItem>-->
<!--<DropdownItem>Another Action</DropdownItem>-->
<!--<DropdownItem>Another Action</DropdownItem>-->
<!--<DropdownItem>Another Action</DropdownItem>-->
<!--<DropdownItem>Another Action</DropdownItem>-->
<!--<DropdownItem>Another Action</DropdownItem>-->
<!--<DropdownItem>Another Action</DropdownItem>-->
<!--</DropdownMenu>-->
<!--</Dropdown>`}-->
<!--	</PrismCode>-->
<!--</pre>-->

<SectionTitle>setActiveFromChild</SectionTitle>
<p>
	Use <code>setActiveFromChild</code> prop to automatically set the dropdown to active when any of the dropdown menu items are active. This <strong>only</strong> works on initial mount. If any menu items change active state, the dropdown won't reflect the change.
</p>
<div class="docs-example">
	<DropdownSetActiveFromChildExample />
</div>
<pre>
	<PrismCode class="language-html">
		{DropdownSetActiveFromChildSource}
	</PrismCode>
</pre>
