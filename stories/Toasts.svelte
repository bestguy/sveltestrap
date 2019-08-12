<script>
  import Toast from "../src/Toast.svelte";
  import ToastBody from "../src/ToastBody.svelte";
  import ToastHeader from "../src/ToastHeader.svelte";
  import { bgColors } from "./colors";
</script>

<h1>Toasts</h1>
<a href="https://getbootstrap.com/docs/4.3/components/toasts/" target="_blank">Bootstrap Toasts</a>

<div class="py-3">
  <h2>Colors</h2>
  {#each bgColors as color}
    <div class="p-3 bg-{color} mb-3">
      <Toast class="mr-1" {color}>
        <ToastHeader>
          Sveltestrap
        </ToastHeader>
        <ToastBody>
          This is a toast on a {color} background — check it out!
        </ToastBody>
      </Toast>
    </div>
  {/each}
</div>


