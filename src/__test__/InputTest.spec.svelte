<script>
    import Input from "../Input.svelte";

    let user = {
        accountEnabled: false
    }

    let onChangeAccountEnabled = false

    const onChange = () => {
        onChangeAccountEnabled = user.accountEnabled
    }
</script>

<Input data-testid="checkbox" type="checkbox" bind:checked={user.accountEnabled} on:change={onChange} />

<p data-testid="reactiveAccountEnabled">
    {user.accountEnabled}
</p>

<p data-testid="onChangeAccountEnabled">
    {onChangeAccountEnabled}
</p>
