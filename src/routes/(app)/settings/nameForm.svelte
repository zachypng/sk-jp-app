<script lang="ts">
	import { browser } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Loader2 } from 'lucide-svelte';
	import { nameForm, names, type NameForm } from './schemas';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';

	export let data: SuperValidated<Infer<NameForm>>;

	const form = superForm(data, {
		validators: zodClient(nameForm),
		delayMs: 1000,
		onSubmit: () => {
			if (browser) {
				toast.success('Name successfully updated!');
			}
		}
	});

	const { form: formData, enhance, delayed, timeout, submitting } = form;

	$: selectedName = $formData.name
		? {
				label: $formData.name,
				value: $formData.name
			}
		: undefined;
</script>

<form method="POST" action="?/updateName" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label class="text-lg font-semibold leading-none tracking-tight"></Form.Label>
			<Select.Root
				selected={selectedName}
				onSelectedChange={(v) => {
					v && ($formData.name = v.value);
				}}
			>
				<Select.Trigger {...attrs} class="w-full max-w-md">
					<Select.Value
						placeholder={$page.data.user.name ? $page.data.user.name : 'Select your name...'}
					/>
				</Select.Trigger>
				<Select.Content>
					{#each names as name}
						<Select.Item value={name} label={name} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.name} name={attrs.name} />
		</Form.Control>
		<Form.Description></Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="mt-4"
		>{#if $delayed}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}Update</Form.Button
	>
</form>
