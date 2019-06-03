<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import {
		Button,
		ButtonGroup,
		ButtonDropdown,
		DropdownToggle,
		DropdownItem,
		DropdownMenu,
	} from 'sveltestrap';

	import ButtonGroupExample from '../examples/ButtonGroup';
	const ButtonGroupExampleSource = require('!!raw-loader!../examples/ButtonGroup').default;

	import ButtonToolbarExample from '../examples/ButtonToolbar';
	const ButtonToolbarExampleSource = require('!!raw-loader!../examples/ButtonToolbar').default;

	let dropdownOpen = false;
</script>

<PageTitle title="Button Group" />
<div class="docs-example">
	<div>
		<ButtonGroupExample />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
	{ButtonGroupExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Button Toolbar</SectionTitle>
<div class="docs-example">
	<ButtonToolbarExample />
</div>
<pre>
	<PrismCode class="language-html">
	{ButtonToolbarExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Sizing</SectionTitle>
<div class="docs-example">
	<ButtonGroup size="lg">
		<Button>Left</Button>
		<Button>Middle</Button>
		<Button>Right</Button>
	</ButtonGroup>
	<br />
	<ButtonGroup class="mt-1">
		<Button>Left</Button>
		<Button>Middle</Button>
		<Button>Right</Button>
	</ButtonGroup>
	<br />
	<ButtonGroup size="sm" class="mt-1">
		<Button>Left</Button>
		<Button>Middle</Button>
		<Button>Right</Button>
	</ButtonGroup>
</div>
<pre>
	<PrismCode class="language-html">
{`<ButtonGroup size="lg">
	<Button>Left</Button>
	<Button>Middle</Button>
	<Button>Right</Button>
</ButtonGroup>
<br />
<ButtonGroup class="mt-1">
	<Button>Left</Button>
	<Button>Middle</Button>
	<Button>Right</Button>
</ButtonGroup>
<br />
<ButtonGroup size="sm" class="mt-1">
	<Button>Left</Button>
	<Button>Middle</Button>
	<Button>Right</Button>
</ButtonGroup>`}
	</PrismCode>
</pre>
<SectionTitle>Nesting</SectionTitle>
<div class="docs-example">
	<ButtonGroup>
		<Button>1</Button>
		<Button>2</Button>
		<ButtonDropdown isOpen={dropdownOpen} toggle="{() => dropdownOpen = !dropdownOpen}">
			<DropdownToggle caret>
				Dropdown
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem>Dropdown Link</DropdownItem>
				<DropdownItem>Dropdown Link</DropdownItem>
			</DropdownMenu>
		</ButtonDropdown>
	</ButtonGroup>
</div>
<pre>
	<PrismCode class="language-html">
{`<ButtonGroup>
	<Button>1</Button>
	<Button>2</Button>
	<ButtonDropdown isOpen={dropdownOpen} toggle="{() => dropdownOpen = !dropdownOpen}">
		<DropdownToggle caret>
			Dropdown
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem>Dropdown Link</DropdownItem>
			<DropdownItem>Dropdown Link</DropdownItem>
		</DropdownMenu>
	</ButtonDropdown>
</ButtonGroup>`}
	</PrismCode>
</pre>
<SectionTitle>Vertical variation</SectionTitle>
<div class="docs-example">
	<ButtonGroup vertical>
		<Button>1</Button>
		<Button>2</Button>
		<ButtonDropdown isOpen={dropdownOpen} toggle="{() => dropdownOpen = !dropdownOpen}">
			<DropdownToggle caret>
				Dropdown
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem>Dropdown Link</DropdownItem>
				<DropdownItem>Dropdown Link</DropdownItem>
			</DropdownMenu>
		</ButtonDropdown>
	</ButtonGroup>
</div>
<pre>
	<PrismCode class="language-html">
{`<ButtonGroup vertical>
	<Button>1</Button>
	<Button>2</Button>
	<ButtonDropdown isOpen={dropdownOpen} toggle="{() => dropdownOpen = !dropdownOpen}">
		<DropdownToggle caret>
			Dropdown
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem>Dropdown Link</DropdownItem>
			<DropdownItem>Dropdown Link</DropdownItem>
		</DropdownMenu>
	</ButtonDropdown>
</ButtonGroup>`}
	</PrismCode>
</pre>
