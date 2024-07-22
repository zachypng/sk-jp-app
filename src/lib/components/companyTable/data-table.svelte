<script lang="ts">
	import { createTable, createRender, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import * as Popover from '$lib/components/ui/popover';
	import DataTableActions from './data-table-actions.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		ArrowUpDown,
		ChevronLeft,
		ChevronRight,
		ChevronsLeft,
		ChevronsRight,
		Filter
	} from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { fade } from 'svelte/transition';

	type Record = {
		id: string;
		createdTime: string;
		fields: {
			Company: string;
			'Last modified time': string;
			countFullyMappedPositions: number | string;
			AUM_Concatenate: string;
		};
	};

	export let records: Record[];
	export let route: 'company' | 'view';

	const table = createTable(readable(records), {
		page: addPagination(),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	const columns = table.createColumns([
		// table.column({
		// 	accessor: (c) => c.id.substring(0, 8) + '...',
		// 	header: 'ID',
		// 	plugins: {
		// 		sort: {
		// 			disable: true
		// 		},
		// 		filter: {
		// 			exclude: true
		// 		}
		// 	}
		// }),
		table.column({
			accessor: (c) => c.fields.Company,
			header: 'Company',
			plugins: {
				sort: {
					disable: false
				}
			}
		}),
		table.column({
			accessor: (c) => c.fields['Last modified time'],
			cell: ({ value }) => new Date(value).toLocaleString('en-US', { dateStyle: 'short' }),
			header: 'Last modified time',
			plugins: {
				sort: {
					disable: false
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (c) => c.fields['countFullyMappedPositions'],
			header: '# of Current Positions',
			plugins: {
				sort: {
					disable: false
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (c) => c.fields.AUM_Concatenate,
			header: 'AUM',
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value, route });
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex, pageCount } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
</script>

<Popover.Root>
	<Popover.Trigger class="mb-2 py-2">
		<Button variant="outline" class="bg-muted/50 shadow-sm dark:bg-muted/20"
			><Filter class="mr-2 h-4 w-4" />Filter</Button
		>
	</Popover.Trigger>
	<Popover.Content
		><Input
			class="max-w-sm bg-muted/50 shadow-sm dark:bg-muted/20"
			placeholder="Search {route} list..."
			type="text"
			bind:value={$filterValue}
		/></Popover.Content
	>
</Popover.Root>
<div
	class="rounded-md border bg-muted/50 shadow-md dark:bg-muted/20"
	transition:fade={{ duration: 300 }}
>
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<Table.Head {...attrs}>
									{#if cell.id === 'Company' || cell.id === '# of Current Positions' || cell.id === 'Last modified time'}
										<Button variant="ghost" on:click={props.sort.toggle}>
											<Render of={cell.render()} />
											<ArrowUpDown class="ml-2 h-4 w-4" />
										</Button>
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<div class="px-6">
										<Render of={cell.render()} />
									</div>
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
	<div class="flex items-center justify-center space-x-12 py-4">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = 0)}
			disabled={!$hasPreviousPage}><ChevronsLeft class="h-4 w-4" /></Button
		>
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}><ChevronLeft class="h-4 w-4" /></Button
		>
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex + 1)}
			disabled={!$hasNextPage}><ChevronRight class="h-4 w-4" /></Button
		>
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageCount - 1)}
			disabled={!$hasNextPage}><ChevronsRight class="h-4 w-4" /></Button
		>
	</div>
</div>
