<script>
	import { Toast, ToastBody, ToastHeader, Spinner } from 'sveltestrap';
</script>

<Toast>
	<ToastHeader icon="primary">
		Sveltestrap
	</ToastHeader>
	<ToastBody>
		This is a toast with a primary icon — check it out!
	</ToastBody>
</Toast>
<Toast>
	<ToastHeader icon="secondary">
		Sveltestrap
	</ToastHeader>
	<ToastBody>
		This is a toast with a secondary icon — check it out!
	</ToastBody>
</Toast>
<Toast>
	<ToastHeader icon="success">
		Sveltestrap
	</ToastHeader>
	<ToastBody>
		This is a toast with a success icon — check it out!
	</ToastBody>
</Toast>
<Toast>
	<ToastHeader icon="danger">
		Sveltestrap
	</ToastHeader>
	<ToastBody>
		This is a toast with a danger icon — check it out!
	</ToastBody>
</Toast>
<Toast>
	<ToastHeader icon="warning">
		Sveltestrap
	</ToastHeader>
	<ToastBody>
		This is a toast with a warning icon — check it out!
	</ToastBody>
</Toast>
<Toast>
	<ToastHeader icon="info">
		Sveltestrap
	</ToastHeader>
	<ToastBody>
		This is a toast with an info icon — check it out!
	</ToastBody>
</Toast>
<Toast>
	<ToastHeader icon="light">
		Sveltestrap
	</ToastHeader>
	<ToastBody>
		This is a toast with a light icon — check it out!
	</ToastBody>
</Toast>
<Toast>
	<ToastHeader icon="dark">
		Sveltestrap
	</ToastHeader>
	<ToastBody>
		This is a toast with a dark icon — check it out!
	</ToastBody>
</Toast>
<Toast>
	<ToastHeader>
		<span slot="icon" class="mr-2">
			<Spinner size="sm" />
		</span>
		Sveltestrap
	</ToastHeader>
	<ToastBody>
		This is a toast with a custom icon — check it out!
	</ToastBody>
</Toast>
