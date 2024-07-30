<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Select from '$lib/components/ui/select';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Check, ChevronsUpDown, Loader2 } from 'lucide-svelte';
	import { mode } from 'mode-watcher';

	import HoldHorses from '$lib/images/holdHorses.svelte';
	import { fly } from 'svelte/transition';
	import { generateFormURL, cn, inputConfig } from '$lib/utils.js';
	import { tick } from 'svelte';

	export let data;

	let popupOpen = data.user.name ? false : true;
	$: autofillOpen = false;
	let open = false;
	let openIMT = false;
	let reloadForms = false;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		openIMT = false;
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<svelte:head>
	<title>JP App - Data Input</title>
	<meta name="description" content="JP Data Team Webapp" />
	<meta name="robots" content="noindex" />
</svelte:head>

<svelte:window
	on:keydown={(e) => {
		if (e.key === ' ' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			autofillOpen = !autofillOpen;
		}
	}}
/>

<Dialog.Root bind:open={popupOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Hold your horses, partner!</Dialog.Title>
			<Dialog.Description>
				<div class="m-4 mx-auto h-24 w-24">
					<HoldHorses />
				</div>
				You should<span class="animate-pulse font-bold text-warning">&nbsp;update your name</span> in
				settings so the data input forms auto-fill your name into respective fields! You can choose to
				ignore this, but your life will forever be difficult and I will not stop pestering everytime
				you open this page...
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				variant="outline"
				class="border-destructive transition-all hover:scale-105 hover:bg-destructive/20"
				on:click={() => (popupOpen = false)}>I choose to suffer</Button
			>
			<Button href="/settings" class="transition-all hover:scale-105">Take me there!</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<div class="mx-auto grid w-full max-w-[100rem]" in:fly={{ y: 200, duration: 1000 }}>
	<main class="col-span-4 gap-4 md:gap-8">
		<div class="grid grid-cols-4 gap-8 px-8 py-7 dark:invert">
			<!-- svelte-ignore a11y-missing-attribute -->
			{#key reloadForms}
				<iframe
					class="airtable-embed bg-base-200 h-[800px] w-full max-w-lg rounded border dark:border-muted/10"
					src={generateFormURL('company', data.user)}
					frameborder="0"
					aria-label="Company Form"
				/>
				<!-- svelte-ignore a11y-missing-attribute -->
				<iframe
					class="airtable-embed bg-base-200 h-[800px] w-full max-w-lg rounded border dark:border-muted/10"
					src={generateFormURL('person', data.user)}
					frameborder="0"
					aria-label="Person Form"
				/>
				<!-- svelte-ignore a11y-missing-attribute -->
				<iframe
					class="airtable-embed bg-base-200 h-[800px] w-full max-w-lg rounded border dark:border-muted/10"
					src={generateFormURL('position', data.user)}
					frameborder="0"
					aria-label="Position Form"
				/>
				<!-- svelte-ignore a11y-missing-attribute -->
				<iframe
					class="airtable-embed bg-base-200 h-full w-full max-w-lg rounded border dark:border-muted/10"
					src={generateFormURL('move', data.user)}
					frameborder="0"
					aria-label="Move Form"
				/>
			{/key}
		</div>
		<div class="mx-8 grid grid-cols-4 rounded-md border py-4">
			<div class="col-span-2 col-start-2 col-end-4 mx-auto w-full px-8">
				<Dialog.Root
					bind:open={autofillOpen}
					onOpenChange={() => {
						if (autofillOpen) reloadForms = !reloadForms;
					}}
				>
					<Dialog.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant={$mode === 'dark' ? 'secondary' : 'default'}
							class="mx-auto w-full"
						>
							<span class="mr-2">Open Autofill Settings</span>
							<kbd
								class="rounded-md border p-1 text-xs dark:border-muted-foreground/60 dark:text-muted-foreground"
								>Ctrl + Space</kbd
							>
						</Button>
					</Dialog.Trigger>
					<Dialog.Content class="h-[calc(100vh-20rem)]">
						<div class="mx-auto w-full max-w-md overflow-scroll">
							<Dialog.Header>
								<Dialog.Title>Autofill Settings</Dialog.Title>
								<Dialog.Description
									>Change what fields are autofilled for data-input. Click anywhere to close and
									apply changes. Reloading the page will reset to defaults.</Dialog.Description
								>
							</Dialog.Header>
							<Tabs.Root value="company" class="mt-4">
								<Tabs.List
									class="w-full max-w-md justify-evenly rounded-b-none rounded-t-md border-l border-r border-t bg-background"
								>
									<Tabs.Trigger
										value="company"
										class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
										>Company</Tabs.Trigger
									>
									<Tabs.Trigger
										value="person"
										class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
										>Person</Tabs.Trigger
									>
									<Tabs.Trigger
										value="position"
										class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
										>Position</Tabs.Trigger
									>
									<Tabs.Trigger
										value="move"
										class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
										>Move</Tabs.Trigger
									>
								</Tabs.List>
								<Tabs.Content
									value="company"
									class="mt-0 w-full max-w-md flex-col gap-y-2 rounded-b-md rounded-t-none border p-4"
								>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="fullyMapped">Fully Mapped</Label>
										<p class="my-1 text-sm text-muted-foreground">Select a default value</p>

										<Select.Root
											onSelectedChange={(v) => {
												if ($inputConfig.company && $inputConfig.company.fields) {
													if (v && v.value) {
														$inputConfig.company.fields['Fully Mapped'] = v.value.toString();
													} else {
														$inputConfig.company.fields['Fully Mapped'] = undefined;
													}
												}
											}}
											selected={$inputConfig.company.fields['Fully Mapped']
												? { value: $inputConfig.company.fields['Fully Mapped'] }
												: undefined}
										>
											<Select.Trigger class="w-full max-w-md">
												<Select.Value
													placeholder={$inputConfig.company.fields['Fully Mapped'] ??
														'Select a default value...'}
												/>
											</Select.Trigger>
											<Select.Content>
												<Select.Item value="">None</Select.Item>
												<Select.Item value="Y">Y</Select.Item>
												<Select.Item value="N">N</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="firmType">Firm Type</Label>
										<p class="my-1 text-sm text-muted-foreground">Select a default firm type</p>
										<Select.Root
											onSelectedChange={(v) => {
												if ($inputConfig.company && $inputConfig.company.fields) {
													if (v && v.value) {
														$inputConfig.company.fields['Firm Type'] = v.value.toString();
													} else {
														$inputConfig.company.fields['Firm Type'] = undefined;
													}
												}
											}}
											selected={$inputConfig.company.fields['Firm Type']
												? { value: $inputConfig.company.fields['Firm Type'] }
												: undefined}
										>
											<Select.Trigger class="w-full max-w-md">
												<Select.Value
													placeholder={$inputConfig.company.fields['Firm Type'] ??
														'Select a default firm type...'}
												/>
											</Select.Trigger>
											<Select.Content class="max-h-64 overflow-y-scroll">
												{#await data.streamed.firmTypes}
													<Loader2 class="h-6 w-6 animate-spin" />
												{:then firmTypes}
													{#each ['', ...firmTypes] as firmType}
														<Select.Item value={firmType}
															>{firmType ? firmType : 'None'}</Select.Item
														>
													{/each}
												{/await}
											</Select.Content>
										</Select.Root>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="currency">Currency</Label>
										<p class="my-1 text-sm text-muted-foreground">Input a default currency</p>
										<Input
											class="mt-2 max-w-md"
											name="currency"
											placeholder="Enter a currency to autofill..."
											bind:value={$inputConfig.company.fields.Currency}
											>{$inputConfig.company.fields.Currency.valueOf()}</Input
										>
									</div>
								</Tabs.Content>
								<Tabs.Content
									value="person"
									class="mt-0 w-full max-w-md flex-col gap-y-2 rounded-b-md rounded-t-none border p-4"
								>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="gender">Gender</Label>
										<p class="my-1 text-sm text-muted-foreground">Select a default gender</p>
										<Select.Root
											onSelectedChange={(v) => {
												if ($inputConfig.person && $inputConfig.person.fields) {
													if (v && v.value) {
														$inputConfig.person.fields.Gender = v.value.toString();
													} else {
														$inputConfig.person.fields.Gender = undefined;
													}
												}
											}}
											selected={$inputConfig.person.fields?.Gender
												? { value: $inputConfig.person.fields?.Gender }
												: undefined}
										>
											<Select.Trigger class="w-full max-w-md">
												<Select.Value
													placeholder={$inputConfig.person.fields.Gender ??
														'Select a default gender...'}
												/>
											</Select.Trigger>
											<Select.Content class="max-h-64 overflow-y-scroll">
												<Select.Item value="">None</Select.Item>
												<Select.Item value="Female">Female</Select.Item>
												<Select.Item value="Male">Male</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="ethnicity">Ethnicity</Label>
										<p class="my-1 text-sm text-muted-foreground">Select a default ethnicity</p>
										<Select.Root
											onSelectedChange={(v) => {
												if ($inputConfig.person && $inputConfig.person.fields) {
													if (v && v.value) {
														$inputConfig.person.fields.Ethnicity = v.value.toString();
													} else {
														$inputConfig.person.fields.Ethnicity = undefined;
													}
												}
											}}
											selected={$inputConfig.person.fields?.Ethnicity
												? { value: $inputConfig.person.fields?.Ethnicity }
												: undefined}
										>
											<Select.Trigger class="w-full max-w-md">
												<Select.Value
													placeholder={$inputConfig.person.fields.Ethnicity ??
														'Select a default ethnicity...'}
												/>
											</Select.Trigger>
											<Select.Content class="max-h-64 overflow-y-scroll">
												{#await data.streamed.ethnicities}
													<Loader2 class="h-6 w-6 animate-spin" />
												{:then ethnicities}
													{#each ['', ...ethnicities].sort( (a, b) => a.localeCompare(b) ) as ethnicity}
														<Select.Item value={ethnicity}
															>{ethnicity ? ethnicity : 'None'}</Select.Item
														>
													{/each}
												{/await}
											</Select.Content>
										</Select.Root>
									</div>
								</Tabs.Content>
								<Tabs.Content
									value="position"
									class="mt-0 w-full max-w-md flex-col gap-y-2 rounded-b-md rounded-t-none border p-4"
								>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="department">Department</Label>
										<p class="my-1 text-sm text-muted-foreground">Select a default department</p>
										<Select.Root
											onSelectedChange={(v) => {
												if ($inputConfig.position && $inputConfig.position.fields) {
													if (v && v.value) {
														$inputConfig.position.fields.Department = v.value.toString();
													} else {
														$inputConfig.position.fields.Department = undefined;
													}
												}
											}}
											selected={$inputConfig.position.fields?.Department
												? { value: $inputConfig.position.fields?.Department }
												: undefined}
										>
											<Select.Trigger class="w-full max-w-md">
												<Select.Value
													placeholder={$inputConfig.position.fields?.Department ??
														'Select a default department...'}
												/>
											</Select.Trigger>
											<Select.Content class="max-h-64 overflow-y-scroll">
												{#await data.streamed.departments}
													<Loader2 class="h-6 w-6 animate-spin" />
												{:then departments}
													{#each ['', ...departments] as department}
														<Select.Item value={department}
															>{department ? department : 'None'}</Select.Item
														>
													{/each}
												{/await}
											</Select.Content>
										</Select.Root>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="writeInTitle">Write-In Title</Label>
										<p class="my-1 text-sm text-muted-foreground">Input a default write-in title</p>
										<Input
											class="mt-2 max-w-md"
											name="writeInTitle"
											placeholder="Enter a write-in title to autofill..."
											bind:value={$inputConfig.position.fields['Write-In Title']}
											>{$inputConfig.position.fields['Write-In Title']}</Input
										>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="location">Location</Label>
										<p class="my-1 text-sm text-muted-foreground">Choose a default location</p>
										<Popover.Root bind:open let:ids>
											<Popover.Trigger asChild let:builder>
												<Button
													builders={[builder]}
													variant="outline"
													role="combobox"
													aria-expanded={open}
													class="w-full max-w-md justify-between font-normal hover:bg-background"
												>
													{$inputConfig.position.fields?.Location ?? 'Select a default location...'}
													<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</Popover.Trigger>
											<Popover.Content class="w-full max-w-md p-0">
												<Command.Root>
													<Command.Input placeholder="Search locations..." />
													<Command.Empty>No location found.</Command.Empty>
													<Command.Group class="max-h-64 overflow-y-scroll">
														{#await data.streamed.locations}
															<Loader2 class="h-6 w-6 animate-spin" />
														{:then locations}
															{#each locations as location, i}
																{#if i === 0}
																	<Command.Item
																		value={undefined}
																		onSelect={(currentValue) => {
																			$inputConfig.position.fields['Location'] = undefined;
																			closeAndFocusTrigger(ids.trigger);
																		}}
																	>
																		<Check
																			class={cn(
																				'mr-2 h-4 w-4',
																				$inputConfig.position.fields['Location'] !== undefined &&
																					'text-transparent'
																			)}
																		/>
																		None
																	</Command.Item>
																{/if}
																<Command.Item
																	value={location.value}
																	onSelect={(currentValue) => {
																		$inputConfig.position.fields.Location = currentValue;
																		closeAndFocusTrigger(ids.trigger);
																	}}
																>
																	<Check
																		class={cn(
																			'mr-2 h-4 w-4',
																			$inputConfig.position.fields.Location !== location.value &&
																				'text-transparent'
																		)}
																	/>
																	{location.label}
																</Command.Item>
															{/each}
														{/await}
													</Command.Group>
												</Command.Root>
											</Popover.Content>
										</Popover.Root>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="seniority">Senior / Junior</Label>
										<p class="my-1 text-sm text-muted-foreground">
											Select a default seniority level
										</p>
										<Select.Root
											onSelectedChange={(v) => {
												if ($inputConfig.position && $inputConfig.position.fields) {
													if (v && v.value) {
														$inputConfig.position.fields['Senior / Junior'] = v.value;
													} else {
														$inputConfig.position.fields['Senior / Junior'] = undefined;
													}
												}
											}}
											selected={$inputConfig.position.fields['Senior / Junior']
												? { value: $inputConfig.position.fields['Senior / Junior'] }
												: undefined}
										>
											<Select.Trigger class="w-full max-w-md">
												<Select.Value
													placeholder={$inputConfig.position.fields['Senior / Junior'] ??
														'Select a default seniority level...'}
												/>
											</Select.Trigger>
											<Select.Content class="max-h-64 overflow-y-scroll">
												<Select.Item value="">None</Select.Item>
												<Select.Item value="Senior">Senior</Select.Item>
												<Select.Item value="Junior">Junior</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="note">Note</Label>
										<p class="my-1 text-sm text-muted-foreground">Input a default note</p>
										<Input
											class="mt-2 max-w-md"
											name="note"
											placeholder="Enter a note to autofill..."
											bind:value={$inputConfig.position.fields.Note}
											>{$inputConfig.position.fields.Note}</Input
										>
									</div>
								</Tabs.Content>
								<Tabs.Content
									value="move"
									class="mt-0 w-full max-w-md flex-col gap-y-2 rounded-b-md rounded-t-none border p-4"
								>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="moveType">Move Type</Label>
										<p class="my-1 text-sm text-muted-foreground">Select a default move type</p>
										<Select.Root
											onSelectedChange={(v) => {
												if ($inputConfig.move && $inputConfig.move.fields) {
													if (v && v.value) {
														$inputConfig.move.fields['Move Type'] = v.value.toString();
													} else {
														$inputConfig.move.fields['Move Type'] = undefined;
													}
												}
											}}
											selected={$inputConfig.move.fields['Move Type']
												? { value: $inputConfig.move.fields['Move Type'] }
												: undefined}
										>
											<Select.Trigger class="w-full max-w-md">
												<Select.Value
													placeholder={$inputConfig.move.fields['Move Type'] ??
														'Select a default move type...'}
												/>
											</Select.Trigger>
											<Select.Content class="max-h-64 overflow-y-scroll">
												<Select.Item value="">None</Select.Item>
												<Select.Item value="Outside Move">Outside Move</Select.Item>
												<Select.Item value="Inside Move">Inside Move</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="keyMove">Key Move</Label>
										<p class="my-1 text-sm text-muted-foreground">Select a default value</p>
										<Select.Root
											onSelectedChange={(v) => {
												if ($inputConfig.move && $inputConfig.move.fields) {
													if (v && v.value) {
														$inputConfig.move.fields['Key Move'] = v.value.toString();
													} else {
														$inputConfig.move.fields['Key Move'] = undefined;
													}
												}
											}}
											selected={$inputConfig.move.fields['Key Move']
												? { value: $inputConfig.move.fields['Key Move'] }
												: undefined}
										>
											<Select.Trigger class="w-full max-w-md">
												<Select.Value
													placeholder={$inputConfig.move.fields['Key Move'] ??
														'Select a default value...'}
												/>
											</Select.Trigger>
											<Select.Content class="max-h-64 overflow-y-scroll">
												<Select.Item value="">None</Select.Item>
												<Select.Item value="Y">Y</Select.Item>
												<Select.Item value="N">N</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="moveByYear">Move By Year</Label>
										<p class="my-1 text-sm text-muted-foreground">Select a default year</p>
										<Select.Root
											onSelectedChange={(v) => {
												if ($inputConfig.move && $inputConfig.move.fields) {
													if (v && v.value) {
														$inputConfig.move.fields['Move by Year'] = v.value.toString();
													} else {
														$inputConfig.move.fields['Move by Year'] = undefined;
													}
												}
											}}
											selected={$inputConfig.move.fields['Move by Year']
												? { value: $inputConfig.move.fields['Move by Year'] }
												: undefined}
										>
											<Select.Trigger class="w-full max-w-md">
												<Select.Value
													placeholder={$inputConfig.move.fields['Move by Year'] ??
														'Select a default year...'}
												/>
											</Select.Trigger>
											<Select.Content class="max-h-64 overflow-y-scroll">
												<Select.Item value="">None</Select.Item>
												<Select.Item value={new Date().getFullYear().toString()}
													>{new Date().getFullYear().toString()}</Select.Item
												>
												<Select.Item value={(new Date().getFullYear() - 1).toString()}
													>{(new Date().getFullYear() - 1).toString()}</Select.Item
												>
												<Select.Item value={(new Date().getFullYear() - 2).toString()}
													>{(new Date().getFullYear() - 2).toString()}</Select.Item
												>
												<Select.Item value={(new Date().getFullYear() - 3).toString()}
													>{(new Date().getFullYear() - 3).toString()}</Select.Item
												>
												<Select.Item value={(new Date().getFullYear() - 4).toString()}
													>{(new Date().getFullYear() - 4).toString()}</Select.Item
												>
												<Select.Item value={(new Date().getFullYear() - 5).toString()}
													>{(new Date().getFullYear() - 5).toString()}</Select.Item
												>
											</Select.Content>
										</Select.Root>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="moveByQuarter">Move By Quarter</Label>
										<p class="my-1 text-sm text-muted-foreground">Select a default quarter</p>
										<Select.Root
											onSelectedChange={(v) => {
												if ($inputConfig.move && $inputConfig.move.fields) {
													if (v && v.value) {
														$inputConfig.move.fields['Move by Quarter'] = v.value.toString();
													} else {
														$inputConfig.move.fields['Move by Quarter'] = undefined;
													}
												}
											}}
											selected={$inputConfig.move.fields['Move by Quarter']
												? { value: $inputConfig.move.fields['Move by Quarter'] }
												: undefined}
										>
											<Select.Trigger class="w-full max-w-md">
												<Select.Value
													placeholder={$inputConfig.move.fields['Move by Quarter'] ??
														'Select a default quarter...'}
												/>
											</Select.Trigger>
											<Select.Content class="max-h-64 overflow-y-scroll">
												<Select.Item value="">None</Select.Item>
												<Select.Item value="Q1">Q1</Select.Item>
												<Select.Item value="Q2">Q2</Select.Item>
												<Select.Item value="Q3">Q3</Select.Item>
												<Select.Item value="Q4">Q4</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
									<div class="my-2">
										<Label class="mt-4 text-lg" for="individualMoveType">Individual Move Type</Label
										>
										<p class="my-1 text-sm text-muted-foreground">
											Choose a default individual move type
										</p>
										<Popover.Root bind:open={openIMT} let:ids>
											<Popover.Trigger asChild let:builder>
												<Button
													builders={[builder]}
													variant="outline"
													role="combobox"
													aria-expanded={openIMT}
													class="w-full max-w-md justify-between font-normal hover:bg-background"
												>
													{$inputConfig.move.fields[
														'Individual Move Type (relates to position at new Company)'
													] ?? 'Select a default individual move type...'}
													<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</Popover.Trigger>
											<Popover.Content class="w-full max-w-md p-0">
												<Command.Root>
													<Command.Input placeholder="Search individual move types..." />
													<Command.Empty>No individual move type found.</Command.Empty>
													<Command.Group class="max-h-64 overflow-y-scroll">
														{#await data.streamed.individualMoveTypes}
															<Loader2 class="h-6 w-6 animate-spin" />
														{:then individualMoveTypes}
															{#each [...individualMoveTypes] as type, i}
																{#if i === 0}
																	<Command.Item
																		value={undefined}
																		onSelect={(currentValue) => {
																			$inputConfig.move.fields[
																				'Individual Move Type (relates to position at new Company)'
																			] = undefined;
																			closeAndFocusTrigger(ids.trigger);
																		}}
																	>
																		<Check
																			class={cn(
																				'mr-2 h-4 w-4',
																				$inputConfig.move.fields[
																					'Individual Move Type (relates to position at new Company)'
																				] !== undefined && 'text-transparent'
																			)}
																		/>
																		None
																	</Command.Item>
																{/if}
																<Command.Item
																	value={type}
																	onSelect={(currentValue) => {
																		$inputConfig.move.fields[
																			'Individual Move Type (relates to position at new Company)'
																		] = currentValue;
																		closeAndFocusTrigger(ids.trigger);
																	}}
																>
																	<Check
																		class={cn(
																			'mr-2 h-4 w-4',
																			$inputConfig.move.fields[
																				'Individual Move Type (relates to position at new Company)'
																			] !== type && 'text-transparent'
																		)}
																	/>
																	{type}
																</Command.Item>
															{/each}
														{/await}
													</Command.Group>
												</Command.Root>
											</Popover.Content>
										</Popover.Root>
									</div>
								</Tabs.Content>
							</Tabs.Root>
						</div>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>
	</main>
</div>

<div class="w-full">
	<div class="container w-full max-w-full rounded-lg">
		<div class="flex-1 space-y-3 px-4">
			<!-- <div class="flex items-center justify-between space-y-2">
				<h2 class="text-3xl font-bold tracking-tight">JP Data Input</h2>
			</div> -->
		</div>
	</div>
</div>
