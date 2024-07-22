<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { orgchartConfig } from '$lib/utils';
	import { Eye } from 'lucide-svelte';
	export let id: string;
	export let route: 'company' | 'view';
</script>

<Button
	variant="outline"
	class="w-[200px]"
	href={`/orgchart/${route}/${id}`}
	on:click={() => ($orgchartConfig.lastTab = route)}><Eye class="mr-2 h-4 w-4" />Open</Button
>
