<script lang="ts">
	import '../../app.pcss';
	import House from 'lucide-svelte/icons/house';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import Settings from 'lucide-svelte/icons/settings';
	import JPLogoBlue from '$lib/images/jp-blue.svelte';
	import JPLogoWhite from '$lib/images/jp-white.svelte';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher, toggleMode, mode } from 'mode-watcher';
	import { Loader2, Network, SquarePen } from 'lucide-svelte';

	import { page } from '$app/stores';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import DropdownMenuLabel from '$lib/components/ui/dropdown-menu/dropdown-menu-label.svelte';

	let loading = false;
	beforeNavigate(() => {
		loading = true;
	});
	afterNavigate(() => {
		loading = false;
	});

	$: activePath = $page.url.pathname;
</script>

<ModeWatcher />
<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
		<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
			<a
				href="/"
				class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base"
			>
				{#if $mode == 'light'}
					<JPLogoBlue class="h-8 w-8 transition-all group-hover:scale-110" />
				{:else}
					<JPLogoWhite class="h-8 w-8 transition-all group-hover:scale-110" />
				{/if}
				<span class="sr-only">Jensen App</span>
			</a>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="/"
						class="flex h-9 w-9 items-center justify-center rounded-lg {activePath === '/'
							? 'bg-accent text-accent-foreground'
							: 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8"
						use:builder.action
						{...builder}
					>
						<House class="h-5 w-5" />
						<span class="sr-only">Dashboard</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Dashboard</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="/datainput"
						class="flex h-9 w-9 items-center justify-center rounded-lg {activePath.includes(
							'/datainput'
						)
							? 'bg-accent text-accent-foreground'
							: 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8"
						use:builder.action
						{...builder}
					>
						<SquarePen class="h-5 w-5" />
						<span class="sr-only">Data Input</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Data Input</Tooltip.Content>
			</Tooltip.Root>
			{#if $page.data.user.isBetaEnrolled == 1}
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<a
							href="/orgchart"
							class="flex h-9 w-9 items-center justify-center rounded-lg {activePath.includes(
								'/orgchart'
							)
								? 'bg-accent text-accent-foreground'
								: 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8"
							use:builder.action
							{...builder}
						>
							<Network class="h-5 w-5" />
							<span class="sr-only">Orgchart</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Orgchart (Beta)</Tooltip.Content>
				</Tooltip.Root>
			{/if}
		</nav>
		<nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<div use:builder.action {...builder}>
						<Button
							variant="ghost"
							class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-transparent hover:text-foreground md:h-8 md:w-8"
							on:click={toggleMode}
						>
							<Sun
								class="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
							/>
							<Moon
								class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
							/>
							<span class="sr-only">Toggle theme</span>
						</Button>
					</div>
				</Tooltip.Trigger>
				<Tooltip.Content side="right"
					>Toggle {$mode == 'dark' ? 'light' : 'dark'} mode</Tooltip.Content
				>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="/settings"
						class="flex h-9 w-9 items-center justify-center rounded-lg {activePath.includes(
							'/settings'
						)
							? 'bg-accent text-accent-foreground'
							: 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8"
						use:builder.action
						{...builder}
					>
						<Settings class="h-5 w-5" />
						<span class="sr-only">Settings</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Settings</Tooltip.Content>
			</Tooltip.Root>
		</nav>
	</aside>
	<div class="flex flex-col sm:pl-14">
		<header
			class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:px-6 sm:py-4 md:px-8"
		>
			<Sheet.Root>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
						<PanelLeft class="h-5 w-5" />
						<span class="sr-only">Toggle Menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="sm:max-w-xs">
					<nav class="grid gap-6 text-lg font-medium">
						<a
							href="/"
							class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
						>
							{#if $mode == 'light'}
								<JPLogoBlue class="h-5 w-5 transition-all group-hover:scale-110" />
							{:else}
								<JPLogoWhite class="h-5 w-5 transition-all group-hover:scale-110" />
							{/if}
							<span class="sr-only">Jensen App</span>
						</a>
						<a
							href="/"
							class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
						>
							<House class="h-5 w-5" />
							Dashboard
						</a>
						<a
							href="/datainput"
							class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
						>
							<SquarePen class="h-5 w-5" />
							Data Input
						</a>
						{#if $page.data.user.isBetaEnrolled == 1}
							<a href="/orgchart" class="flex items-center gap-4 px-2.5 text-foreground">
								<Network class="h-5 w-5" />
								Orgchart (Beta)
							</a>
						{/if}
						<a
							href="/settings"
							class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
						>
							<Settings class="h-5 w-5" />
							Settings
						</a>
					</nav>
				</Sheet.Content>
			</Sheet.Root>
			<h1 class="text-2xl font-bold leading-tight tracking-tight">
				{$page.data.title || ''}
			</h1>
			<div class="relative ml-auto flex-1 md:grow-0">
				<!-- insert cmdk-sv here if needed -->
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						size="icon"
						class="overflow-hidden rounded-full"
					>
						<Avatar.Root>
							<Avatar.Image src="" alt="" />
							<Avatar.Fallback>{$page.data.user.email.slice(0, 1).toUpperCase()}</Avatar.Fallback>
						</Avatar.Root>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					{#if $page.data.user.name}
						<DropdownMenuLabel class="text-muted-foreground"
							>{$page.data.user.name}</DropdownMenuLabel
						>
					{:else}
						<DropdownMenuLabel class="bg-warning/10"
							><a href="/settings" class="text-warning underline"
								>Click to update your name in settings!</a
							></DropdownMenuLabel
						>
						<DropdownMenuLabel class="text-muted-foreground"
							>{$page.data.user.email}</DropdownMenuLabel
						>
					{/if}
					<DropdownMenu.Separator />
					{#if $page.url.pathname.includes('/orgchart/view/viw') || $page.url.pathname.includes('/orgchart/company/rec')}
						<DropdownMenu.Label>Keyboard Shortcuts</DropdownMenu.Label>
						<DropdownMenu.Item>
							<span class="mr-2">Info</span>
							<DropdownMenu.Shortcut class="rounded-md bg-muted p-1 text-xs">
								Ctrl+I
							</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span class="mr-2">Search</span>
							<DropdownMenu.Shortcut class="rounded-md bg-muted p-1 text-xs">
								Ctrl+K
							</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span class="mr-2">Photos</span>
							<DropdownMenu.Shortcut class="rounded-md bg-muted p-1 text-xs">
								Ctrl+;
							</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span class="mr-2">Bios</span>
							<DropdownMenu.Shortcut class="rounded-md bg-muted p-1 text-xs">
								Ctrl+B
							</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span class="mr-2">Edit Mode</span>
							<DropdownMenu.Shortcut class="rounded-md bg-muted p-1 text-xs">
								Ctrl+M
							</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span class="mr-2">Node Count</span>
							<DropdownMenu.Shortcut class="rounded-md bg-muted p-1 text-xs">
								Ctrl+U
							</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span class="mr-2">Back</span>
							<DropdownMenu.Shortcut class="rounded-md bg-muted p-1 text-xs">
								Ctrl+/
							</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
					{/if}
					<DropdownMenu.Item href="/settings">Settings</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item class="text-destructive" href="/logout">Logout</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</header>
		<div>
			<Toaster position="top-center" />
			{#if loading}
				<div
					class="grid h-full grow grid-flow-row grid-rows-3 items-center justify-center gap-4 p-4"
				>
					<Loader2 class="row-start-2 mx-auto my-auto flex h-12 w-12 grow animate-spin" />
				</div>
			{:else}
				<slot />
			{/if}
		</div>
	</div>
</div>
