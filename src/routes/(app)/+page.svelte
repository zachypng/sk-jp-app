<script lang="ts">
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import Users from 'lucide-svelte/icons/users';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Eye, Loader2, Network, UserCheck, UserPlus } from 'lucide-svelte';
	import Airtable from '$lib/images/Airtable.svelte';
	export let data;

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

<svelte:head>
	<title>JP App - Home</title>
	<meta name="description" content="JP Data Team Webapp" />
</svelte:head>

<div class="flex w-full flex-col">
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		<h1 class="text-3xl font-bold tracking-tight">
			Welcome back, {data.user.nickname ? data.user.nickname : data.user.name || ''}
		</h1>
		<div class="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Moves Gathering</Card.Title>
					<Users class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					{#await data.streamed.inputtedMoves}
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
					{#await data.streamed.inputtedMoves}
						<Loader2 class="h-8 w-8 animate-spin" />
					{:then inputted}
						{#await data.streamed.pendingMoves}
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
					{#await data.streamed.positionCount}
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
					{#await data.streamed.recentlyModified}
						<Loader2 class="h-8 w-8 animate-spin" />
					{:then value}
						<div class="text-2xl font-bold">{value.length.toLocaleString()}</div>
						<p class="text-xs text-muted-foreground">maps modified in the last 30 days</p>
					{/await}
				</Card.Content>
			</Card.Root>
		</div>
		<div class="hidden gap-4 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4">
			<Card.Root class="lg:col-span-3">
				<Tabs.Root value="recents" class="w-full flex-1 flex-row gap-2">
					<Tabs.List class="w-full flex-1 columns-2 flex-row border-b bg-background p-6">
						<Tabs.Trigger
							value="recents"
							class="flex-1 flex-col space-y-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>Recently Updated</Tabs.Trigger
						>
						<Tabs.Trigger
							value="aumUpdate"
							class="flex-1 flex-col space-y-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>Out of Date</Tabs.Trigger
						>
					</Tabs.List>
					<Tabs.Content value="recents">
						<Card.Header class="flex flex-row items-center">
							<div class="grid gap-2">
								<Card.Title>Recently Modified Maps</Card.Title>
								<Card.Description
									>List of fully-mapped companies that have recent modifications</Card.Description
								>
							</div>
							<Button
								href="https://airtable.com/app6rqTtoNCCajSS1/tblqTddKRbCwD0hhB/viwPyaPbBM4je2gla?blocks=hide"
								size="sm"
								class="ml-auto gap-1"
								target="_blank"
							>
								View in Airtable
								<ArrowUpRight class="h-4 w-4" />
							</Button>
						</Card.Header>
						<Card.Content>
							{#await data.streamed.recentlyModified}
								<Loader2 class="h-8 w-8 animate-spin" />
							{:then value}
								<div class="flex max-h-[67vh] shrink flex-col rounded-md border py-1">
									<Table.Root class="">
										<Table.Header class="sticky top-0 flex-1 flex-row bg-background">
											<Table.Row>
												<Table.Head class="font-bold text-primary">#</Table.Head>
												{#each Object.keys(value[0]) as key}
													{#if key !== 'company_id'}
														<Table.Head class="font-bold text-primary">{key}</Table.Head>
													{/if}
												{/each}
												{#if data.user.isBetaEnrolled == 1}
													<Table.Head class="text-center font-bold text-primary"
														>Orgchart</Table.Head
													>
												{/if}
											</Table.Row>
										</Table.Header>
										<Table.Body class="flex-1 flex-col">
											{#each value.slice(0, 20) as record, i}
												<Table.Row>
													<Table.Cell class="font-sm text-muted-foreground">{i + 1}</Table.Cell>
													<Table.Cell>
														<div class="font-medium">{record.Company}</div>
													</Table.Cell>
													<Table.Cell>
														<p class="text-xs dark:text-muted-foreground">{record.firmType}</p>
													</Table.Cell>
													<Table.Cell
														><p class="text-xs dark:text-muted-foreground">
															{new Date(record.aum_last_modified).toLocaleDateString() ===
															'Invalid Date'
																? ''
																: new Date(record.aum_last_modified).toLocaleDateString()}
														</p></Table.Cell
													>
													<Table.Cell
														><p class="text-xs dark:text-muted-foreground">
															{new Date(record.position_last_modified).toLocaleDateString() ===
															'Invalid Date'
																? ''
																: new Date(record.position_last_modified).toLocaleDateString()}
														</p></Table.Cell
													>
													{#if data.user.isBetaEnrolled == 1}
														<Table.Cell class="border-l bg-secondary dark:bg-muted/20">
															<Button
																href="/orgchart/company/{record.company_id}"
																size="sm"
																variant="outline"
																class="w-full"
															>
																<Eye class="mr-2 h-4 w-4" />
																View Orgchart
															</Button>
														</Table.Cell>
													{/if}
												</Table.Row>
											{/each}
										</Table.Body>
									</Table.Root>
								</div>
							{/await}
						</Card.Content>
					</Tabs.Content>
					<Tabs.Content value="aumUpdate">
						<Card.Header class="flex flex-row items-center">
							<div class="grid gap-2">
								<Card.Title>Out-of-Date AUMs</Card.Title>
								<Card.Description
									>List of fully-mapped companies that have non-updated AUMs</Card.Description
								>
							</div>
							<Button
								href="https://airtable.com/app6rqTtoNCCajSS1/tblqTddKRbCwD0hhB/viwU3AEM22G8X4x31?blocks=hide"
								size="sm"
								class="ml-auto gap-1"
								target="_blank"
							>
								View in Airtable
								<ArrowUpRight class="h-4 w-4" />
							</Button>
						</Card.Header>
						<Card.Content>
							{#await data.streamed.outOfDate}
								<Loader2 class="h-8 w-8 animate-spin" />
							{:then value}
								<div class="flex max-h-[67vh] shrink flex-col rounded-md border py-1">
									<Table.Root class="">
										<Table.Header class="sticky top-0 flex-1 flex-row bg-background">
											<Table.Row>
												<Table.Head class="font-bold text-primary">#</Table.Head>
												{#each Object.keys(value[0]) as key}
													{#if key !== 'company_id'}
														<Table.Head class="font-bold text-primary">{key}</Table.Head>
													{/if}
												{/each}

												<Table.Head class="text-center font-bold text-primary"
													>Record Link</Table.Head
												>
											</Table.Row>
										</Table.Header>
										<Table.Body class="flex-1 flex-col">
											{#each value as record, i}
												<Table.Row>
													<Table.Cell class="font-sm text-muted-foreground">{i + 1}</Table.Cell>
													<Table.Cell>
														<div class="line-clamp-2 font-medium">{record.Company}</div>
													</Table.Cell>
													<Table.Cell
														><p class="text-xs dark:text-muted-foreground">
															{record.firmType}
														</p></Table.Cell
													>
													<Table.Cell
														><p class="text-xs dark:text-muted-foreground">
															{new Date(record.aum_last_modified).toLocaleDateString() ===
															'Invalid Date'
																? ''
																: new Date(record.aum_last_modified).toLocaleDateString()}
														</p></Table.Cell
													>
													<Table.Cell
														><p class="text-xs dark:text-muted-foreground">
															{new Date(record.position_last_modified).toLocaleDateString() ===
															'Invalid Date'
																? ''
																: new Date(record.position_last_modified).toLocaleDateString()}
														</p></Table.Cell
													>

													<Table.Cell class="border-l bg-secondary dark:bg-muted/20">
														<Button
															href="https://airtable.com/app6rqTtoNCCajSS1/tblqTddKRbCwD0hhB/viwU3AEM22G8X4x31/{record.company_id}?blocks=hide"
															size="sm"
															target="_blank"
															variant="outline"
															class="w-full"
														>
															<Airtable class="mr-2 h-4 w-4" />
															View Record
														</Button>
													</Table.Cell>
												</Table.Row>
											{/each}
										</Table.Body>
									</Table.Root>
								</div>
							{/await}
						</Card.Content>
					</Tabs.Content>
				</Tabs.Root>
			</Card.Root>
			<Card.Root class="lg:col-span-1">
				<Card.Header class="space-y-0 px-6 pb-1 pt-6">
					<Card.Title>Moves by Strategy</Card.Title>
					<Card.Description>Breakdown of inputted/pending moves by move type</Card.Description>
				</Card.Header>
				<Card.Content class="grid max-h-[75vh] gap-2 overflow-scroll">
					{#await getGroups(data.streamed.inputtedMoves)}
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
									{#await data.streamed.pendingMoves then val}
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
		</div>
	</main>
</div>
