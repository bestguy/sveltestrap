<script>
	import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';

	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import ButtonDropdownExample from '../examples/ButtonDropdown';
	const ButtonDropdownExampleSource = require('!!raw-loader!../examples/ButtonDropdown').default;

	import Example from '../examples/ButtonDropdownMulti';
	import ExampleSplit from '../examples/ButtonDropdownMultiSplit';
	import ButtonDropdownUncontrolledExample from '../examples/ButtonDropdownUncontrolled'
	const ButtonDropdownUncontrolledExampleSource = require('!!raw-loader!../examples/ButtonDropdownUncontrolled').default;

	let btnLg = false;
	let btnSm = false;
	let btnDropup = false;
	let btnDropleft = false;
	let btnDropright = false;
</script>

<div class="docs-example">
	<ButtonDropdownExample />
</div>
<pre>
	<PrismCode class="language-html">
		{ButtonDropdownExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Single button dropdowns</SectionTitle>
<div class="docs-example">
	<div>
		<Example color="primary" text="Primary" />
		<Example color="secondary" text="Secondary" />
		<Example color="success" text="Success" />
		<Example color="info" text="Info" />
		<Example color="warning" text="Warning" />
		<Example color="danger" text="Danger" />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
{`<ButtonDropdown isOpen={isOpen} toggle={toggle}>
  <DropdownToggle caret color="primary">
    Text
  </DropdownToggle>
  <DropdownMenu>
    <DropdownItem header>Header</DropdownItem>
    <DropdownItem disabled>Action</DropdownItem>
    <DropdownItem>Another Action</DropdownItem>
    <DropdownItem divider/>
    <DropdownItem>Another Action</DropdownItem>
  </DropdownMenu>
</ButtonDropdown>`}
	</PrismCode>
</pre>

<SectionTitle>Split button dropdowns</SectionTitle>
<div class="docs-example">
	<div>
		<ExampleSplit color="primary" text="Primary" />
		<ExampleSplit color="secondary" text="Secondary" />
		<ExampleSplit color="success" text="Success" />
		<ExampleSplit color="info" text="Info" />
		<ExampleSplit color="warning" text="Warning" />
		<ExampleSplit color="danger" text="Danger" />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
{`<ButtonDropdown isOpen={isOpen} toggle={toggle}>
	<Button id="caret" color="primary">{text}</Button>
	<DropdownToggle caret color="primary" />
	<DropdownMenu>
		<DropdownItem header>Header</DropdownItem>
		<DropdownItem disabled>Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem divider/>
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</ButtonDropdown>`}
	</PrismCode>
</pre>
<SectionTitle>Sizing</SectionTitle>
<div class="docs-example">
	<div>
		<ButtonDropdown isOpen={btnLg} toggle="{() => btnLg = !btnLg}">
		<DropdownToggle caret size="lg">
			Large Button
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem>Another Action</DropdownItem>
			<DropdownItem>Another Action</DropdownItem>
		</DropdownMenu>
		</ButtonDropdown>
	</div>
	<div class="mt-1">
		<ButtonDropdown isOpen={btnSm} toggle="{() => btnSm = !btnSm}">
		<DropdownToggle caret size="sm">
			Small Button
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem>Another Action</DropdownItem>
			<DropdownItem>Another Action</DropdownItem>
		</DropdownMenu>
		</ButtonDropdown>
	</div>
</div>
<pre>
	<PrismCode class="language-html">
{`<ButtonDropdown isOpen={btnLg} toggle="{() => btnLg = !btnLg}">
	<DropdownToggle caret size="lg">
		Large Button
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</ButtonDropdown>

<ButtonDropdown isOpen={btnSm} toggle="{() => btnSm = !btnSm}">
	<DropdownToggle caret size="sm">
		Small Button
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</ButtonDropdown>`}
	</PrismCode>
</pre>
<SectionTitle>Uncontrolled Dropdown</SectionTitle>
<div class="docs-example">
	<ButtonDropdownUncontrolledExample />
</div>
<pre>
	<PrismCode class="language-html">
		{ButtonDropdownUncontrolledExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Drop direction variations</SectionTitle>
<div class="docs-example">
	<div>
		<ButtonDropdown direction="up" isOpen={btnDropup} toggle="{() => btnDropup = !btnDropup}">
		<DropdownToggle caret>
			Dropup
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem>Another Action</DropdownItem>
			<DropdownItem>Another Action</DropdownItem>
		</DropdownMenu>
		</ButtonDropdown>
		<ButtonDropdown direction="left" isOpen={btnDropleft} toggle="{() => btnDropleft = !btnDropleft}">
		<DropdownToggle caret>
			Dropleft
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem>Another Action</DropdownItem>
			<DropdownItem>Another Action</DropdownItem>
		</DropdownMenu>
		</ButtonDropdown>
		<ButtonDropdown direction="right" isOpen={btnDropright} toggle="{() => btnDropright = !btnDropright}">
		<DropdownToggle caret>
			Dropright
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem>Another Action</DropdownItem>
			<DropdownItem>Another Action</DropdownItem>
		</DropdownMenu>
		</ButtonDropdown>
	</div>
</div>
<pre>
	<PrismCode class="language-html">
{`<ButtonDropdown direction="up" isOpen={btnDropup} toggle="{() => btnDropup = !btnDropup}">
	<DropdownToggle caret>
		Dropup
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
	</ButtonDropdown>
	<ButtonDropdown direction="left" isOpen={btnDropleft} toggle="{() => btnDropleft = !btnDropleft}">
	<DropdownToggle caret>
		Dropleft
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
	</ButtonDropdown>
	<ButtonDropdown direction="right" isOpen={btnDropright} toggle="{() => btnDropright = !btnDropright}">
	<DropdownToggle caret>
		Dropright
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</ButtonDropdown>`}
	</PrismCode>
</pre>
