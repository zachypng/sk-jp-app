<script lang="ts">
	import { generateFormURL } from '$lib/utils';
	import type { PageData } from './$types';

	export let reloadForms;
	export let user: PageData['user'];
</script>

<div class="grid grid-cols-4 gap-8 px-8 py-7 dark:invert">
	<!-- svelte-ignore a11y-missing-attribute -->
	{#key reloadForms}
		<iframe
			class="airtable-embed bg-base-200 h-[800px] w-full max-w-lg rounded border dark:border-muted/10"
			src={generateFormURL('company', user)}
			frameborder="0"
			aria-label="Company Form"
		/>
		<!-- svelte-ignore a11y-missing-attribute -->
		<iframe
			class="airtable-embed bg-base-200 h-[800px] w-full max-w-lg rounded border dark:border-muted/10"
			src={generateFormURL('person', user)}
			frameborder="0"
			aria-label="Person Form"
		/>
		<!-- svelte-ignore a11y-missing-attribute -->
		<iframe
			class="airtable-embed bg-base-200 h-[800px] w-full max-w-lg rounded border dark:border-muted/10"
			src={generateFormURL('position', user)}
			frameborder="0"
			aria-label="Position Form"
		/>
		<!-- svelte-ignore a11y-missing-attribute -->
		<iframe
			class="airtable-embed bg-base-200 h-full w-full max-w-lg rounded border dark:border-muted/10"
			src={generateFormURL('move', user)}
			frameborder="0"
			aria-label="Move Form"
		/>
	{/key}
</div>
