<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import { ArrowUpRight, Eye, Loader2 } from 'lucide-svelte';
	import Airtable from '$lib/images/Airtable.svelte';

	export let streamed: PageData['streamed'];
	export let user: PageData['user'];
</script>

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
				{#await streamed.recentlyModified}
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
									{#if user.isBetaEnrolled == 1}
										<Table.Head class="text-center font-bold text-primary">Orgchart</Table.Head>
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
												{new Date(record.aum_last_modified).toLocaleDateString() === 'Invalid Date'
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
										{#if user.isBetaEnrolled == 1}
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
				{#await streamed.outOfDate}
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

									<Table.Head class="text-center font-bold text-primary">Record Link</Table.Head>
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
												{new Date(record.aum_last_modified).toLocaleDateString() === 'Invalid Date'
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
