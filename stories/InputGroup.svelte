<script lang="typescript">
  import InputGroup from '../src/InputGroup.svelte';
  import InputGroupAddon from '../src/InputGroupAddon.svelte';
  import InputGroupText from '../src/InputGroupText.svelte';
  import Input from '../src/Input.svelte';
</script>

<div>
  <InputGroup>
    <InputGroupAddon addonType="prepend">
      <InputGroupText>@</InputGroupText>
    </InputGroupAddon>
    <Input placeholder="username" />
  </InputGroup>
  <br />
  <InputGroup>
    <InputGroupAddon addonType="prepend">
      <InputGroupText>
        <Input
          addon
          type="checkbox"
          aria-label="Checkbox for following text input" />
      </InputGroupText>
    </InputGroupAddon>
    <Input placeholder="Check it out" />
  </InputGroup>
  <br />
  <InputGroup>
    <Input placeholder="username" />
    <InputGroupAddon addonType="append">
      <InputGroupText>@example.com</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
  <br />
  <InputGroup>
    <InputGroupAddon addonType="prepend">
      <InputGroupText>$</InputGroupText>
      <InputGroupText>$</InputGroupText>
    </InputGroupAddon>
    <Input placeholder="Dolla dolla billz yo!" />
    <InputGroupAddon addonType="append">
      <InputGroupText>$</InputGroupText>
      <InputGroupText>$</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
  <br />
  <InputGroup>
    <InputGroupAddon addonType="prepend">
      <InputGroupText>$</InputGroupText>
    </InputGroupAddon>
    <Input placeholder="Amount" min={0} max={100} type="number" step="1" />
    <InputGroupAddon addonType="append">
      <InputGroupText>.00</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
</div>

<h2>Size</h2>
<div>
  <InputGroup size="lg">
    <InputGroupAddon addonType="prepend">
      <InputGroupText>@lg</InputGroupText>
    </InputGroupAddon>
    <Input />
  </InputGroup>
  <br />
  <InputGroup>
    <InputGroupAddon addonType="prepend">
      <InputGroupText>@normal</InputGroupText>
    </InputGroupAddon>
    <Input />
  </InputGroup>
  <br />
  <InputGroup size="sm">
    <InputGroupAddon addonType="prepend">
      <InputGroupText>@sm</InputGroupText>
    </InputGroupAddon>
    <Input />
  </InputGroup>
</div>
