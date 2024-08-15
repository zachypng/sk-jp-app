<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		ArrowLeftToLine,
		Image,
		Info,
		Text,
		Shovel,
		Hash,
		Download,
		Ban,
		SquareMousePointer,
		Search,
		Palette
	} from 'lucide-svelte';
	import { orgchartConfig } from '$lib/config';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { mode } from 'mode-watcher';
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			$orgchartConfig.showInfo = !$orgchartConfig.showInfo;
		} else if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			$orgchartConfig.showBios = !$orgchartConfig.showBios;
		} else if (e.key === 'u' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			$orgchartConfig.showNodeCount = !$orgchartConfig.showNodeCount;
		} else if (e.key === 'm' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			$orgchartConfig.allowEdits = !$orgchartConfig.allowEdits;
		} else if ((e.key === '/' || e.key === 'NumpadDivide') && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			window.history.back();
		} else if (e.key === ';' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			$orgchartConfig.showPhotos = !$orgchartConfig.showPhotos;
		}
	}}
/>

<div class="flex h-full w-full flex-col space-y-2 overflow-scroll p-4">
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				class="h-full max-h-20 w-full max-w-16 items-center"
				on:click={() => {
					$orgchartConfig.showInfo = !$orgchartConfig.showInfo;
				}}
			>
				<div
					class="flex w-full flex-col items-center justify-center {$orgchartConfig.showInfo
						? 'text-sky-500'
						: 'text-muted-foreground'}"
				>
					<Info class="h-5 w-5" />
					<p class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs">
						Info
					</p>
				</div>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content side="left">
			<p class="text-sm">Toggle the info popout that includes hires & departures</p>
		</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				class="h-full max-h-20 w-full max-w-16 items-center"
				on:click={() => {
					$orgchartConfig.searchOpen = !$orgchartConfig.searchOpen;
				}}
			>
				<div
					class="flex w-full flex-col items-center justify-center {$orgchartConfig.searchOpen
						? 'text-sky-500'
						: 'text-muted-foreground'}"
				>
					<Search class="h-5 w-5" />
					<p class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs">
						Search
					</p>
				</div>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content side="left">
			<p class="text-sm">Search for nodes in the chart</p>
		</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				class="h-full max-h-20 w-full max-w-16 items-center"
				on:click={() => {
					$orgchartConfig.showPhotos = !$orgchartConfig.showPhotos;
				}}
			>
				<div
					class="flex w-full flex-col items-center justify-center {$orgchartConfig.showPhotos
						? 'text-sky-500'
						: 'text-muted-foreground'}"
				>
					<Image class="h-5 w-5" />
					<p class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs">
						Photos
					</p>
				</div>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content side="left">
			<p class="text-sm">Toggle the display of photos within chart nodes</p>
		</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				class="h-full max-h-20 w-full max-w-16 items-center"
				on:click={() => {
					$orgchartConfig.showBios = !$orgchartConfig.showBios;
				}}
			>
				<div
					class="flex w-full flex-col items-center justify-center {$orgchartConfig.showBios
						? 'text-sky-500'
						: 'text-muted-foreground'}"
				>
					<Text class="h-5 w-5" />
					<p class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs">
						Bios
					</p>
				</div>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content side="left">
			<p class="text-sm">
				{$orgchartConfig.showBios ? 'Disable' : 'Enable'} the display of bios when hovering over chart
				nodes
			</p>
		</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button
						variant="ghost"
						class="h-full max-h-20 w-full max-w-16 items-center"
						builders={[builder]}
					>
						<div class="flex w-full flex-col items-center justify-center text-muted-foreground">
							<SquareMousePointer class="h-5 w-5" />
							<p
								class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs"
							>
								Detail
							</p>
						</div>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56" side="left">
					<DropdownMenu.Label>Detail to display on nodes</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.RadioGroup bind:value={$orgchartConfig.detail}>
						<DropdownMenu.RadioItem
							value="department"
							class={$orgchartConfig.detail === 'department'
								? 'text-sky-500'
								: 'text-muted-foreground'}>Department</DropdownMenu.RadioItem
						>
						<DropdownMenu.RadioItem
							value="location"
							class={$orgchartConfig.detail === 'location'
								? 'text-sky-500'
								: 'text-muted-foreground'}>Location</DropdownMenu.RadioItem
						>
						<DropdownMenu.RadioItem
							value="gender"
							class={$orgchartConfig.detail === 'gender' ? 'text-sky-500' : 'text-muted-foreground'}
							>Gender</DropdownMenu.RadioItem
						>
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Tooltip.Trigger>
		<Tooltip.Content side="left">
			<p class="text-sm">Select which detail is shown at the bottom of each node</p>
		</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button
						variant="ghost"
						class="h-full max-h-20 w-full max-w-16 items-center"
						builders={[builder]}
					>
						<div class="flex w-full flex-col items-center justify-center text-muted-foreground">
							<Palette class="h-5 w-5" />
							<p
								class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs"
							>
								Color
							</p>
						</div>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56" side="left">
					<DropdownMenu.Label>Coloring to display on nodes</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.RadioGroup bind:value={$orgchartConfig.colorBy}>
						<DropdownMenu.RadioItem
							value="level"
							class={$orgchartConfig.colorBy === 'level' ? 'text-sky-500' : 'text-muted-foreground'}
							>Level</DropdownMenu.RadioItem
						>
						<DropdownMenu.RadioItem
							value="ethnicity"
							class={$orgchartConfig.colorBy === 'ethnicity'
								? 'text-sky-500'
								: 'text-muted-foreground'}>Ethnicity</DropdownMenu.RadioItem
						>
						<DropdownMenu.RadioItem
							value="department"
							class={$orgchartConfig.colorBy === 'department'
								? 'text-sky-500'
								: 'text-muted-foreground'}>Department</DropdownMenu.RadioItem
						>
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Tooltip.Trigger>
		<Tooltip.Content side="left">
			<p class="text-sm">Select which field is used to color each node</p>
		</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				class="h-full max-h-20 w-full max-w-16 items-center"
				on:click={() => {
					$orgchartConfig.allowEdits = !$orgchartConfig.allowEdits;
				}}
			>
				<div
					class="flex w-full flex-col items-center justify-center {$orgchartConfig.allowEdits
						? 'text-sky-500'
						: 'text-muted-foreground'}"
				>
					<Shovel class="h-5 w-5" />
					<p class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs">
						Edit Mode
					</p>
				</div>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content side="left">
			<p class="text-sm">
				{$orgchartConfig.allowEdits ? 'Disable' : 'Enable'} the ability to edit the position of nodes
				in the chart
			</p>
		</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				class="h-full max-h-20 w-full max-w-16 items-center"
				on:click={() => {
					$orgchartConfig.showNodeCount = !$orgchartConfig.showNodeCount;
				}}
			>
				<div
					class="flex w-full flex-col items-center justify-center {$orgchartConfig.showNodeCount
						? 'text-sky-500'
						: 'text-muted-foreground'}"
				>
					<Hash class="h-5 w-5" />
					<p class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs">
						Node Count
					</p>
				</div>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content side="left">
			<p class="text-sm">
				{$orgchartConfig.showNodeCount ? 'Disable' : 'Enable'} displaying the number of nodes in the
				bottom left of the chart
			</p>
		</Tooltip.Content>
	</Tooltip.Root>

	{#if $mode === 'light'}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					variant="ghost"
					class="h-full max-h-20 w-full max-w-16 items-center"
					on:click={() => {
						$orgchartConfig.downloadOpen = !$orgchartConfig.downloadOpen;
					}}
				>
					<div
						class="flex w-full flex-col items-center justify-center {$orgchartConfig.downloadOpen
							? 'text-sky-500'
							: 'text-muted-foreground'}"
					>
						<Download class="h-5 w-5" />
						<p class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs">
							Download
						</p>
					</div>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="left">
				<p class="text-sm">Download an SVG copy of the orgchart.</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{:else}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button variant="ghost" disabled class="h-full max-h-20 w-full max-w-16 items-center">
					<div
						class="flex w-full flex-col items-center justify-center {$orgchartConfig.downloadOpen
							? 'text-sky-500'
							: 'text-muted-foreground'}"
					>
						<Ban class="h-5 w-5" />
						<p class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs">
							Download
						</p>
					</div>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="left">
				<p class="text-sm">Switch to light mode to download an SVG copy of the orgchart.</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{/if}
	<div class="grow"></div>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button variant="ghost" class="mt-auto h-full w-full max-w-16 items-center" href="/orgchart">
				<div class="flex w-full flex-col items-center justify-center text-muted-foreground">
					<ArrowLeftToLine class="h-5 w-5" />
					<p class="mt-2 flex max-w-8 justify-center whitespace-break-spaces text-center text-xs">
						Back
					</p>
				</div>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content side="left">
			<p class="text-sm">
				Return to the {$orgchartConfig.lastTab} selection page
			</p>
		</Tooltip.Content>
	</Tooltip.Root>
</div>
