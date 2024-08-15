<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Loader2, Network, UserCheck, UserPlus, Users } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let user: PageData['user'];
	export let streamed: PageData['streamed'];
</script>

<h1 class="text-3xl font-bold tracking-tight">
	Welcome back, {user.nickname ? user.nickname : user.name || ''}
</h1>
<div class="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Moves Gathering</Card.Title>
			<Users class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await streamed.inputtedMoves}
				<Loader2 class="h-8 w-8 animate-spin" />
			{:then value}
				<div class="text-2xl font-bold">
					<span
						class="rounded-md px-1 {value.length >= 600
							? 'bg-success/20 text-green-500'
							: value.length >= 300
								? 'bg-warning/20 text-warning'
								: 'bg-destructive/20 text-destructive dark:bg-destructive/30'}"
						>{value.length.toLocaleString()}</span
					>
				</div>
				<p class="text-xs text-muted-foreground">tracked this quarter</p>
			{/await}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Moves Input</Card.Title>
			<UserPlus class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await streamed.inputtedMoves}
				<Loader2 class="h-8 w-8 animate-spin" />
			{:then inputted}
				{#await streamed.pendingMoves}
					<Loader2 class="h-8 w-8 animate-spin" />
				{:then value}
					<div class="text-2xl font-bold">
						<span
							class="rounded-md px-1 {value.length + inputted.length >= 600
								? 'bg-success/20 text-green-500'
								: value.length + inputted.length >= 300
									? 'bg-warning/20 text-warning'
									: 'bg-destructive/20 text-destructive dark:bg-destructive/30'}"
							>{value.length.toLocaleString()}</span
						>
					</div>
					<p class="text-xs text-muted-foreground">to be inputted</p>
				{/await}
			{/await}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Current Positions</Card.Title>
			<UserCheck class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await streamed.positionCount}
				<Loader2 class="h-8 w-8 animate-spin" />
			{:then value}
				<div class="text-2xl font-bold">{value.toLocaleString()}</div>
				<p class="text-xs text-muted-foreground">fully-mapped current positions</p>
			{/await}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Maps</Card.Title>
			<Network class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			{#await streamed.recentlyModified}
				<Loader2 class="h-8 w-8 animate-spin" />
			{:then value}
				<div class="text-2xl font-bold">{value.length.toLocaleString()}</div>
				<p class="text-xs text-muted-foreground">maps modified in the last 30 days</p>
			{/await}
		</Card.Content>
	</Card.Root>
</div>
