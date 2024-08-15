<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />

<div class="min-h-[calc(100vh - 4rem)] flex flex-col">
	<slot />
	<div
		class="fixed bottom-0 right-0 top-[73px] z-30 hidden w-24 flex-col border-l bg-background sm:flex"
	>
		<Sidebar />
	</div>
</div>
