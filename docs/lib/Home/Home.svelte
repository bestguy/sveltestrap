<script>
	import { Button, Container, Row, Col, Jumbotron } from 'sveltestrap';

	import PrismCode from '../UI/PrismCode.svelte';
	import Example from '../examples/import-basic.svelte';

	const importBasic = require('!!raw-loader!../examples/import-basic.svelte').default;
</script>

<div>
	<Jumbotron tag="section" class="jumbotron-header text-center mb-3">
		<Container>
			<Row>
				<Col>
					<h1 class="jumbotron-heading display-4">sveltestrap</h1>
					<p class="lead">
						Easy to use Svelte Bootstrap 4 components based on <a href="https://github.com/reactstrap/reactstrap" target="_blank" rel="noopener nofollow">reactstrap</a>.
					</p>
					<p>
						<Button outline color="danger" href="https://github.com/bestguy/sveltestrap">GitHub</Button>
						<Button color="danger" href="/#components/">Components</Button>
					</p>
				</Col>
			</Row>
		</Container>
	</Jumbotron>
	<Container>
		<Row class="justify-content-sm-center">
			<Col sm={8} class="docSearch-content">
			<h2>Installation</h2>
			<hr />
			<h3 class="mt-5">NPM</h3>
			<p>Install sveltestrap and peer dependencies via NPM</p>
			<pre>
              <PrismCode class="language-bash">npm install --save sveltestrap svelte</PrismCode>
            </pre>
			<p>Import the components you need</p>
			<div class="docs-example">
				<Example />
			</div>
			<pre>
              <PrismCode class="language-html">
                {importBasic}
              </PrismCode>
            </pre>
			<h4>Adding Bootstrap</h4>
			<p>Install sveltestrap and Bootstrap from NPM. Sveltestrap does not include Bootstrap CSS so this needs to be installed as well:</p>
			<pre>
              <PrismCode class="language-bash">
  {`npm install --save bootstrap
npm install --save sveltestrap svelte`}
              </PrismCode>
            </pre>
			<p>Import Bootstrap CSS in the <code>src/index.js</code> file:</p>
			<pre>
              <PrismCode class="language-bash">import 'bootstrap/dist/css/bootstrap.min.css';</PrismCode>
            </pre>
			<p>Import required sveltestrap components within <code>src/App.svelte</code> file or your custom component files:</p>
			<pre>
              <PrismCode class="language-bash">
                {`import { Button } from 'sveltestrap';`}
              </PrismCode>
            </pre>
			<p>Now you are ready to use the imported sveltestrap components within your component hierarchy.
			<h2 class="mt-5">About the Project</h2>
			<hr />
			<p>This library contains Svelte Bootstrap 4 components that favor composition and control. The library does not depend on jQuery or Bootstrap javascript.</p>
			</Col>
		</Row>
	</Container>
</div>
