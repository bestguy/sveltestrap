<script lang="ts">
  import { InputGroup, InputGroupText, Input } from 'sveltestrap';
</script>

<div>
  <InputGroup>
    <InputGroupText>@</InputGroupText>
    <Input placeholder="username" />
  </InputGroup>
  <br />
  <InputGroup>
    <InputGroupText>
      <Input
        addon
        type="checkbox"
        aria-label="Checkbox for following text input"
      />
    </InputGroupText>

    <Input placeholder="Check it out" />
  </InputGroup>
  <br />
  <InputGroup>
    <Input placeholder="username" />
    <InputGroupText>@example.com</InputGroupText>
  </InputGroup>
  <br />
  <InputGroup>
    <InputGroupText>$</InputGroupText>
    <InputGroupText>$</InputGroupText>
    <Input placeholder="Dolla dolla billz yo!" />
    <InputGroupText>$</InputGroupText>
    <InputGroupText>$</InputGroupText>
  </InputGroup>
  <br />
  <InputGroup>
    <InputGroupText>$</InputGroupText>
    <Input placeholder="Amount" min={0} max={100} type="number" step="1" />
    <InputGroupText>.00</InputGroupText>
  </InputGroup>
</div>

<h2>Size</h2>
<div>
  <InputGroup size="lg">
    <InputGroupText>@lg</InputGroupText>
    <Input />
  </InputGroup>
  <br />
  <InputGroup>
    <InputGroupText>@normal</InputGroupText>
    <Input />
  </InputGroup>
  <br />
  <InputGroup size="sm">
    <InputGroupText>@sm</InputGroupText>
    <Input />
  </InputGroup>
</div>
