<script lang="ts">
  import Example from '../Example.svelte';
  import DynamicValidation from './DynamicValidation.svelte';
  import dynamicValidationSource from '!!raw-loader!./DynamicValidation.svelte';
  import Validation from './Validation.svelte';
  import validationSource from '!!raw-loader!./Validation.svelte';
</script>

<h1>Form</h1>
<a href="https://getbootstrap.com/docs/5.3/forms/validation/" target="_blank">
  Bootstrap Validation
</a>

<Example title="Validation" source={validationSource}>
  <Validation />
</Example>

<Example title="Dynamic Validation" source={dynamicValidationSource}>
  <DynamicValidation />
</Example>
