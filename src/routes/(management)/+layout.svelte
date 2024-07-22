<script>
	import '../../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { Loader2 } from 'lucide-svelte';

	let loading = false;
	beforeNavigate(() => {
		setTimeout(() => {
			loading = true;
		}, 1000);
	});
	afterNavigate(() => {
		setTimeout(() => {
			loading = false;
		}, 1000);
	});
</script>

<ModeWatcher />
{#if loading}
	<Loader2 class="h-12 w-12 animate-spin" />
{:else}
	<slot />
{/if}
