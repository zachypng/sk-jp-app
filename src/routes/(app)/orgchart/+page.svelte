<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import CompanyTable from '$lib/components/companyTable/data-table.svelte';
	import ViewTable from '$lib/components/viewTable/data-table.svelte';
	import { orgchartConfig } from '$lib/utils';

	export let data;
</script>

<svelte:head>
	<title>JP App - Orgchart Beta</title>
	<meta name="description" content="JP Data Team Webapp Orgchart Beta" />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto flex w-full max-w-5xl items-center justify-center pt-12">
	<Tabs.Root value={$orgchartConfig.lastTab} class="w-full">
		<Tabs.List class="grid w-full grid-cols-2 shadow">
			<Tabs.Trigger
				value="company"
				class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
				>Company</Tabs.Trigger
			>
			<Tabs.Trigger
				value="view"
				class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
				>View</Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="company">
			<div class="mx-auto w-full max-w-5xl py-8">
				{#await data.companies}
					<Loader2 class="h-12 w-12 animate-spin" />
				{:then companies}
					<CompanyTable records={companies} route="company" />
				{/await}
			</div>
		</Tabs.Content>
		<Tabs.Content value="view">
			<div class="mx-auto w-full max-w-5xl py-8">
				{#await data.views}
					<Loader2 class="h-12 w-12 animate-spin" />
				{:then views}
					<ViewTable records={views} route="view" />
				{/await}
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
