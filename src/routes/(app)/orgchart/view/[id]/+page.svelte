<script lang="ts">
	import { mode } from 'mode-watcher';
	import Orgchart from '$lib/components/Orgchart.svelte';
	import { orgchartConfig } from '$lib/config';
	import InfoTab from '$lib/components/InfoTab.svelte';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>JP App - {data.title}</title>
	<meta name="description" content="JP Data Team Webapp Orgchart Beta" />
	<meta name="robots" content="noindex" />
</svelte:head>

{#key $mode}
	{#key $orgchartConfig.showPhotos}
		{#key $orgchartConfig.showBios}
			{#key $orgchartConfig.allowEdits}
				{#key $orgchartConfig.detail}
					{#key $orgchartConfig.colorBy}
						{#await data.positions then positions}
							<div class="flex w-full max-w-[calc(100vw-9.45rem)] flex-row">
								<div
									class="{$orgchartConfig.showInfo
										? 'basis-4/5'
										: 'basis-full'} noscrollbar -mt-6 w-full"
								>
									<Orgchart {positions} />
								</div>
								{#if $orgchartConfig.showInfo}
									<div
										class="max-h-[calc(100vh-73px)] w-full basis-1/3 overflow-y-scroll border-l"
										in:fly={{ x: '80%', duration: 600 }}
										out:fly={{ x: '80%', duration: 600 }}
									>
										<InfoTab moveData={data.moves} companyData={data.company} />
									</div>
								{/if}
							</div>
						{/await}
					{/key}
				{/key}
			{/key}
		{/key}
	{/key}
{/key}

<style>
	.noscrollbar::-webkit-scrollbar {
		display: none; /* Chrome and Safari */
	}
	.noscrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
