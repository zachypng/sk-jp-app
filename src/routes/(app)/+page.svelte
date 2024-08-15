<script lang="ts">
	import Cards from './Cards.svelte';
	import Tables from './Tables.svelte';
	import Groups from './Groups.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>JP App - Home</title>
	<meta name="description" content="JP Data Team Webapp" />
</svelte:head>

<div class="flex w-full flex-col">
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		<Cards streamed={data.streamed} user={data.user} />
		<div class="hidden gap-4 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4">
			<Tables streamed={data.streamed} user={data.user} />
			<Groups streamed={data.streamed} />
		</div>
	</main>
</div>
