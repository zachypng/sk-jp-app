<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	$: open = true;
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class="hidden">Open</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action will log out this client. You will have to log in again if you wish to use the
				app.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => window.history.back()}>Cancel</AlertDialog.Cancel>
			<form action="?/logout" method="post">
				<AlertDialog.Action type="submit">Logout</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
