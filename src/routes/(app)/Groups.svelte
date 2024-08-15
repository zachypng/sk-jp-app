<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let streamed: PageData['streamed'];

	async function getGroups(
		val: Promise<
			{
				move: any;
				moveType: any;
				inputted: any;
			}[]
		>
	) {
		const value = await val;
		const res = Object.groupBy(value, ({ moveType }) => moveType);
		return res;
	}
</script>

<Card.Root class="lg:col-span-1">
	<Card.Header class="space-y-0 px-6 pb-1 pt-6">
		<Card.Title>Moves by Strategy</Card.Title>
		<Card.Description>Breakdown of inputted/pending moves by move type</Card.Description>
	</Card.Header>
	<Card.Content class="grid max-h-[75vh] gap-2 overflow-scroll">
		{#await getGroups(streamed.inputtedMoves)}
			<Loader2 class="h-9 w-9 animate-spin" />
		{:then value}
			{#each Object.entries(value).sort((a, b) => (b[1] ? b[1].length : 0) - (a[1] ? a[1].length : 0)) as moveType, i}
				<div class="flex items-center gap-4 rounded-md bg-background py-4 pr-8">
					<div class="flex h-9 w-9 items-center rounded-full border">
						<p
							class="flex-1 place-self-center text-center text-sm font-medium text-muted-foreground"
						>
							{i + 1}
						</p>
					</div>
					<div class="grid gap-1">
						<p class="text-md font-medium leading-none">{moveType[0]}</p>
						{#await streamed.pendingMoves then val}
							<p class="text-sm text-muted-foreground">
								{val.filter((move) => move.moveType === moveType[0]).length} pending
							</p>
						{/await}
					</div>
					<div class="ml-auto text-lg font-bold">{moveType[1]?.length}</div>
				</div>
			{/each}
		{/await}
	</Card.Content>
</Card.Root>
