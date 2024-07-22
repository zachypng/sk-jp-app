<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { mode } from 'mode-watcher';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as go from 'gojs';
	import { AlertCircle, Check, ChevronsUpDown, Search } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { enhance } from '$app/forms';
	import { cn, orgchartConfig, slugify } from '$lib/utils';
	import { Node } from 'gojs';

	type Position = {
		key: string | number;
		parent?: string | number;
		name: string;
		title?: string;
		location?: string;
		biography?: string;
	};

	let myDiagram: go.Diagram;
	let diagramDiv: HTMLDivElement;
	let form: HTMLFormElement;
	let value = '';
	let open = true;

	$: searchString = positions.find((f) => f.name === value)?.name ?? 'Search nodes...';
	// $: searchString = '';
	$: positionID = '';
	$: managerID = '';
	$: nodeCount = 0;

	export let positions: Position[];

	// let parentMap = positions.map((e) => e.parent);

	onMount(() => {
		function setDraggedLinkVisibility(tool: go.DraggingTool, val: boolean) {
			if (!tool.draggedParts) return;
			var it = tool.draggedParts.iterator;
			while (it.next()) {
				var p = it.key;
				if (p instanceof go.Node) {
					var lit = p.linksConnected;
					while (lit.next()) {
						var l = lit.value;
						l.visible = val;
					}
				}
			}
		}
		const $ = go.GraphObject.make; // for conciseness in defining templates

		myDiagram = new go.Diagram(
			diagramDiv, // must be the ID or reference to div
			{
				allowCopy: false,
				allowDelete: false,
				// initialAutoScale: go.AutoScale.Uniform,
				initialScale: 0.6,
				// initialDocumentSpot: go.Spot.Top,
				maxSelectionCount: 1, // users can select only one part at a time
				layout: $(go.TreeLayout, {
					treeStyle: go.TreeStyle.LastParents,
					arrangement: go.TreeArrangement.Horizontal,
					// properties for most of the tree:
					angle: 90,
					layerSpacing: 35,
					// properties for the "last parents":
					alternateAngle: 90,
					alternateLayerSpacing: 35,
					alternateAlignment: go.TreeAlignment.Bus,
					alternateNodeSpacing: 20
				}),
				hasHorizontalScrollbar: false,
				hasVerticalScrollbar: false,
				'undoManager.isEnabled': false, // disable undo & redo because it's client-side
				'themeManager.changesDivBackground': true,
				'themeManager.currentTheme': $mode,
				allowMove: $orgchartConfig.allowEdits,
				scrollMargin: new go.Margin(100, 100, 100, 100),
				'toolManager.mouseWheelBehavior': go.WheelMode.Zoom,
				'toolManager.hoverDelay': $orgchartConfig.showBios ? 90 : Infinity,
				'toolManager.toolTipDuration': $orgchartConfig.showBios ? Infinity : 0,
				'draggingTool.dragsLink': false,
				'draggingTool.isGridSnapEnabled': true,
				'draggingTool.gridSnapCellSize': new go.Size(10, 10),
				'draggingTool.dragsTree': true,
				'dragSelectingTool.isEnabled': false,
				LayoutCompleted: (e) => {
					e.diagram.moveParts(e.diagram.nodes, new go.Point(0, 0), false);
				}
			}
		);

		// when the document is modified, add a "*" to the title and enable the "Save" button

		// set up some colors/fonts for the default ('light') and dark Themes
		myDiagram.themeManager.set('light', {
			colors: {
				background: '#ffffff',
				text: '#020817',
				textHighlight: '#f1f5f9',
				subtext: '#64748b',
				badge: '#f0fdf4',
				badgeBorder: '#16a34a33',
				badgeText: '#15803d',
				divider: '#64748b',
				shadow: '#64748b80',
				tooltip: '#1f2937',
				levels: [
					'#AC193D',
					'#2672EC',
					'#8C0095',
					'#5133AB',
					'#008299',
					'#D24726',
					'#008A00',
					'#094AB2'
				],
				dragOver: '#f0f9ff',
				link: '#9ca3af',
				div: '#ffffff00',
				border: '#64748b70',
				highlight: '#facc15'
			},
			fonts: {
				// name: '500 0.875rem Inter, sans-serif',
				name: '700 1.2rem Inter, sans-serif',
				// normal: '1rem Inter, sans-serif',
				normal: '0.875rem Inter, sans-serif',
				badge: '500 0.75rem Inter, sans-serif',
				link: '600 0.875rem Inter, sans-serif'
			}
		});

		myDiagram.themeManager.set('dark', {
			colors: {
				background: '#1e293b',
				text: '#f8fafc',
				subtext: '#94a3b8',
				badge: '#22c55e19',
				badgeBorder: '#22c55e21',
				badgeText: '#4ade80',
				// shadow: '#111827',
				shadow: '#020817',
				dragOver: '#082f49',
				link: '#6b7280',
				div: '#ffffff00',
				border: '#94a3b870',
				highlight: '#facc15'
			},
			fonts: {
				// name: '500 0.875rem Inter, sans-serif',
				name: '700 1.2rem Inter, sans-serif',
				// normal: '1rem Inter, sans-serif',
				normal: '0.875rem Inter, sans-serif',
				badge: '500 0.75rem Inter, sans-serif',
				link: '600 0.875rem Inter, sans-serif'
			}
		});

		// this is used to determine feedback during drags
		function mayWorkFor(node1: Node, node2: Node) {
			if (!(node1 instanceof go.Node && node2 instanceof go.Node)) return false; // must be a Node
			if (node1 === node2) return false; // cannot work for yourself
			if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
			if (node2.findTreeRoot() === node2) return false; // you cannot change manager to company record lol
			return true;
		}

		// gets the total number of nodes
		function getNodeCount() {
			nodeCount = myDiagram.nodes.count - 1;
		}

		// function removeHangers(nodes: Node) {
		// 	for (let i = 0; i < nodes.length; i++) {
		// 		if (nodes[i].data.parent === )
		// 	}

		// 	if (node !== null) {
		// 				myDiagram.model.commit((m) => {
		// 					const chl = node.findTreeChildrenNodes();
		// 					// iterate through the children and set their parent key to our selected node's parent key
		// 					while (chl.next()) {
		// 						const emp = chl.value;
		// 						m.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
		// 					}
		// 					// and now remove the selected node itself
		// 					m.removeNodeData(node.data);
		// 				}, 'reparent remove');
		// 			}
		// }

		// This converter is used by the Picture.
		// function findHeadShot(pic) {
		// 	if (!pic) return '../samples/images/user.svg'; // There are only 16 images on the server
		// 	return '../samples/images/HS' + pic;
		// }

		// Used to convert the node's tree level into a theme color
		function findLevelColor(node: Node) {
			return node.findTreeLevel();
		}

		// define the Node template
		myDiagram.nodeTemplate = new go.Node(go.Panel.Spot, {
			isShadowed: true,
			shadowOffset: new go.Point(0, 2),
			selectionObjectName: 'BODY',
			// show/hide buttons when mouse enters/leaves
			// mouseEnter: (e, node) =>
			// 	(node.findObject('BUTTON').opacity = node.findObject('BUTTONX').opacity = 1),
			// mouseLeave: (e, node) =>
			// 	(node.findObject('BUTTON').opacity = node.findObject('BUTTONX').opacity = 0),
			// handle dragging a Node onto a Node to (maybe) change the reporting relationship
			mouseDragEnter: (e, obj, prev) => {
				const diagram = obj.diagram;
				const node = obj as Node;
				if (!diagram) return;
				const selnode = diagram.selection.first() as Node; // max selection is set to 1, so this will always be correct
				if (!selnode) return;
				if (!mayWorkFor(selnode, node)) return;
				positionID = selnode.data.key;
				managerID = node.data.key;
				const shape = node.findObject('SHAPE') as go.Shape;
				if (shape) {
					(shape as any)._prevFill = shape.fill; // remember the original brush
					shape.fill = diagram.themeManager.findValue('dragOver', 'colors'); // "#e0f2fe";
				}
			},
			mouseDragLeave: (e, obj, next) => {
				const node = obj as Node;
				const shape = node.findObject('SHAPE') as go.Shape;
				positionID = '';
				managerID = '';
				if (shape && (shape as any)._prevFill) {
					shape.fill = (shape as any)._prevFill; // restore the original brush
				}
			},
			mouseDrop: (e, obj) => {
				const diagram = obj.diagram;
				const node = obj as Node;
				if (!diagram) return;
				const selnode = diagram.selection.first() as Node; // assume just one Node in selection
				if (mayWorkFor(selnode, node)) {
					// find any existing link into the selected node
					const link = selnode?.findTreeParentLink();
					positionID = selnode?.data.key;
					managerID = node.data.key;
					form.requestSubmit();
					if (link !== null) {
						// reconnect any existing link
						link.fromNode = node;
					} else {
						// else create a new link
						diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
					}
				}
			},
			toolTip: $orgchartConfig.showBios
				? new go.Adornment('Auto', { name: 'ToolTip' })
						.add(
							new go.Shape('RoundedRectangle', {})
								.theme('fill', 'background')
								.theme('stroke', 'border')
						)
						.add(
							new go.TextBlock({
								margin: 8,
								// maxSize: new go.Size(480, 240),
								wrap: go.Wrap.Fit,
								maxLines: 24,
								visible: $orgchartConfig.showBios,
								isMultiline: true
							})
								.bind('text', 'biography')
								.bind('maxSize', 'biography', (biography) =>
									!!biography ? new go.Size(480, 240) : null
								)
								.bind('visible', 'biography', (biography) => (!!biography ? true : false))
								.theme('font', 'normal')
								.theme('stroke', 'text')
						)
						.bind('visible', 'logoURL', (logoURL) => !!logoURL)
				: null
		})
			.add(
				new go.Panel(go.Panel.Auto, { name: 'BODY' })
					.bind('visible', 'logoURL', (logoURL) => !logoURL)
					.add(
						// define the node's outer shape
						new go.Shape('RoundedRectangle', {
							name: 'SHAPE',
							strokeWidth: 0,
							portId: '',
							spot1: go.Spot.TopLeft,
							spot2: go.Spot.BottomRight
						})
							.bind('strokeWidth', 'isHighlighted', (h) => (h ? 4 : 0))
							.theme('fill', 'background')
							.theme('stroke', 'highlight'),
						new go.Panel(go.Panel.Table, { margin: 0.5, defaultRowSeparatorStrokeWidth: 0.5 })
							.theme('defaultRowSeparatorStroke', 'divider')
							.add(
								new go.Panel(go.Panel.Table, { padding: new go.Margin(18, 18, 18, 24) })
									.addColumnDefinition(0, { width: 240 })
									.add(
										new go.Panel(go.Panel.Table, {
											column: 0,
											alignment: go.Spot.Left,
											stretch: go.Stretch.Vertical,
											defaultAlignment: go.Spot.Left
										}).add(
											new go.Panel(go.Panel.Horizontal, { row: 0 }).add(
												new go.TextBlock({
													editable: true,
													minSize: new go.Size(10, 14),
													textAlign: 'center'
												})
													.bindTwoWay('text', 'name')
													.theme('stroke', 'text')
													.theme('font', 'name')
												// new go.Panel(go.Panel.Auto, { margin: new go.Margin(0, 0, 0, 10) }).add(
												// 	new go.Shape('Capsule', {
												// 		parameter1: 6,
												// 		parameter2: 6,
												// 		visible: false
												// 	})
												// 		.bind('visible', 'location', () => (location ? true : false))
												// 		.theme('fill', 'badge')
												// 		.theme('stroke', 'badgeBorder'),
												// 	new go.TextBlock({
												// 		editable: true,
												// 		minSize: new go.Size(10, 12),
												// 		margin: new go.Margin(2, -1)
												// 	})
												// 		.bindTwoWay('text', 'location')
												// 		.bind('visible', 'location', () => (location ? true : false))
												// 		.theme('stroke', 'badgeText')
												// 		.theme('font', 'badge')
												// )
											),
											new go.TextBlock({
												row: 1,
												rowSpan: 2,
												margin: new go.Margin(10, 0, 0, 0),
												editable: false,
												minSize: new go.Size(100, 55),
												width: 200,
												maxLines: 3,
												overflow: go.TextOverflow.Ellipsis,
												font: '1rem Inter, sans-serif'
											})
												.bind('text', 'title')
												.theme('stroke', 'subtext')
											// .theme('font', 'normal')
										),
										new go.Panel(go.Panel.Spot, { isClipping: true, column: 1 }).add(
											new go.Shape('Circle', { desiredSize: new go.Size(70, 70), strokeWidth: 0 }),
											new go.Picture({
												name: 'PICTURE',
												source: '',
												desiredSize: new go.Size(70, 70),
												visible: $orgchartConfig.showPhotos,
												imageStretch: go.ImageStretch.UniformToFill
											}).bind('source', 'photoURL')
										)
									),
								new go.Panel(go.Panel.Table, {
									row: 1,
									stretch: go.Stretch.Horizontal,
									defaultColumnSeparatorStrokeWidth: 0.5,
									width: 240,
									height: 40
								})
									.theme('defaultColumnSeparatorStroke', 'divider')
									.add(
										new go.TextBlock({
											editable: true,
											minSize: new go.Size(10, 12),
											margin: new go.Margin(2, -1)
										})
											.bind('text', $orgchartConfig.detail)
											.bind('visible', $orgchartConfig.detail, () =>
												$orgchartConfig.detail ? true : false
											)
											.theme('stroke', 'subtext')
											.theme('font', 'normal')
									)
								// new go.Panel(go.Panel.Table, {
								// 	row: 1,
								// 	stretch: go.Stretch.Horizontal,
								// 	defaultColumnSeparatorStrokeWidth: 0.5
								// })
								// 	.theme('defaultColumnSeparatorStroke', 'divider')
								// 	.add(makeBottomButton('EMAIL'), makeBottomButton('PHONE'))
							)
					), // end Auto Panel
				new go.Shape('RoundedLeftRectangle', {
					alignment: go.Spot.Left,
					alignmentFocus: go.Spot.Left,
					stretch: go.Stretch.Vertical,
					width: 6,
					strokeWidth: 0
				})
					.bind('visible', 'logoURL', (logoURL) => !logoURL)
					.themeObject('fill', '', 'levels', findLevelColor),

				$(
					'TreeExpanderButton',
					{
						_treeExpandedFigure: 'LineUp',
						_treeCollapsedFigure: 'LineDown',
						name: 'BUTTONX',
						alignment: go.Spot.Bottom,
						opacity: 0 // initially not visible
					},
					// button is visible either when node is selected or on mouse-over
					new go.Binding('opacity', 'isSelected', (s) => (s ? 1 : 0)).ofObject()
				)
			)
			.theme('shadowColor', 'shadow')
			// for sorting, have the Node.text be the data.name
			.bind('text', 'name')
			// bind the Part.layerName to control the Node's layer depending on whether it isSelected
			.bindObject('layerName', 'isSelected', (sel) => (sel ? 'Foreground' : ''))
			.bindTwoWay('isTreeExpanded')
			.add(
				new go.Picture({
					name: 'LOGO',
					visible: false,
					maxSize: new go.Size(350, 147),
					imageStretch: go.ImageStretch.Uniform,
					background: 'white'
				})
					.bind('visible', 'logoURL', (logoURL) => !!logoURL && !logoURL.endsWith('.svg'))
					.bind('source', 'logoURL')
					.bind('width', 'logoWidth')
					.bind('height', 'logoHeight')
			);

		// define the Link template
		myDiagram.linkTemplate = $(
			go.Link,
			{ routing: go.Routing.Orthogonal, layerName: 'Background', corner: 5 },
			$(go.Shape, { strokeWidth: 2 }, new go.ThemeBinding('stroke', 'link'))
		); // the link shape

		myDiagram.model = new go.TreeModel([...positions]);

		// remove nodes with no parent or children (hides stragglers)
		myDiagram.nodes.each(function (node) {
			if (node.isTreeLeaf && node.isTreeRoot) {
				myDiagram.remove(node);
			}
		});

		myDiagram.toolManager.draggingTool.doActivate = function () {
			go.DraggingTool.prototype.doActivate.call(this);
			setDraggedLinkVisibility(this, false);
		};

		myDiagram.toolManager.draggingTool.doDeactivate = function () {
			setDraggedLinkVisibility(this, true);
			go.DraggingTool.prototype.doDeactivate.call(this);
		};

		myDiagram.addDiagramListener('InitialLayoutCompleted', (e) => {
			// find the corresponding Node
			const node = myDiagram.findNodeForData(positions[0]);
			// and center it and select it
			if (!node) return;
			myDiagram.centerRect(node.actualBounds);
		});

		getNodeCount();

		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				$orgchartConfig.searchOpen = !$orgchartConfig.searchOpen;
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	function myCallback(blob: Blob) {
		var url = window.URL.createObjectURL(blob);
		var filename = `${slugify(positions[0].name)}.svg`;

		var a = document.createElement('a');

		a.style.display = 'none';
		a.href = url;
		a.download = filename;

		// IE 11 - should not be necessary, commented out to avoid having to global declare Navigator and such
		// if (window.navigator.msSaveBlob !== undefined) {
		// 	window.navigator.msSaveBlob(blob, filename);
		// 	return;
		// }

		document.body.appendChild(a);
		requestAnimationFrame(() => {
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		});
	}

	function makeSvg() {
		var svg = myDiagram.makeSvg({ scale: 1, background: 'white' });
		if (!svg) return;
		var svgstr = new XMLSerializer().serializeToString(svg);
		var blob = new Blob([svgstr], { type: 'image/svg+xml' });
		myCallback(blob);
		if ($orgchartConfig.downloadOpen) {
			$orgchartConfig.downloadOpen = false;
		}
	}

	function closeAndFocusTrigger(triggerId: string) {
		$orgchartConfig.searchOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	function searchDiagram(input: string) {
		// called by button
		// var input = searchString;
		if (!input) return;
		myDiagram.focus();

		myDiagram.startTransaction('highlight search');

		if (input !== '' && input !== 'Search nodes...') {
			// search four different data properties for the string, any of which may match for success
			// create a case insensitive RegExp from what the user typed
			var safe = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			var regex = new RegExp(safe, 'i');
			var results = myDiagram.findNodesByExample(
				{ name: regex },
				{ location: regex },
				{ title: regex },
				{ department: regex },
				{ gender: regex }
			);
			myDiagram.highlightCollection(results);
			// try to center the diagram at the first node that was found
			if (!results) return;
			if (results.count > 0) {
				myDiagram.scale = 1.5;
				myDiagram.centerRect((results.first() as go.Node).actualBounds);
			}
		} else {
			// empty string only clears highlighteds collection
			myDiagram.clearHighlighteds();
		}

		myDiagram.commitTransaction('highlight search');
	}
</script>

<form
	action="?/updateManager"
	method="post"
	id="managerChange"
	class="hidden"
	use:enhance
	bind:this={form}
>
	<!-- <label for="positionID">Position ID</label> -->
	<input type="hidden" name="positionID" bind:value={positionID} />
	<!-- <label for="managerID">Manager ID</label> -->
	<input type="hidden" name="managerID" bind:value={managerID} />
	<!-- <button type="submit" class="rounded-md border p-3">Update Man</button> -->
</form>

<Dialog.Root
	bind:open={$orgchartConfig.downloadOpen}
	closeOnOutsideClick={true}
	closeOnEscape={true}
>
	<Dialog.Trigger />
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="flex flex-row items-center"
				><AlertCircle class="mr-2 h-6 w-6" />Orgchart Download</Dialog.Title
			>
			<Dialog.Description>
				You have requested to download this orgchart. Click the button below to download an SVG
				copy.
			</Dialog.Description>
		</Dialog.Header>
		<Button on:click={() => makeSvg()}>Download</Button>
		<Button
			variant="destructive"
			on:click={() => (($orgchartConfig.downloadOpen = false), myDiagram.undoManager.undo())}
			>Cancel</Button
		>
	</Dialog.Content>
</Dialog.Root>

<!-- Search -->
<Dialog.Root bind:open={$orgchartConfig.searchOpen} closeOnOutsideClick={true} closeOnEscape={true}>
	<Dialog.Trigger />
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="flex flex-row items-center">
				<Search class="mr-2 h-6 w-6" />Search
			</Dialog.Title>
			<Dialog.Description>Find a node by name and center the viewport</Dialog.Description>
		</Dialog.Header>
		<!-- <Input bind:value={searchString} placeholder="Search nodes..." />
		<Button
			on:click={() => searchDiagram(searchString)}
			on:click={() => ($orgchartConfig.searchOpen = false)}>Search</Button
		> -->
		<Popover.Root bind:open let:ids>
			<Popover.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					class="w-full max-w-md justify-between"
				>
					{searchString}
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</Popover.Trigger>
			<Popover.Content class="w-full max-w-md p-0" side="top">
				<Command.Root>
					<Command.Input placeholder="Search nodes..." />
					<Command.Empty>Node not found.</Command.Empty>
					<Command.Group class="max-h-64 overflow-scroll" heading="Names">
						{#each [...positions].slice(1).sort((a, b) => a.name.localeCompare(b.name)) as position}
							<Command.Item
								value={position.name}
								onSelect={(currentValue) => {
									value = currentValue;
									closeAndFocusTrigger(ids.trigger);
									searchDiagram(value);
									open = false;
									$orgchartConfig.searchOpen = false;
								}}
							>
								<Check class={cn('mr-2 h-4 w-4', value !== position.name && 'text-transparent')} />
								{position.name}
								<span
									class="ml-2 line-clamp-1 flex-1 text-ellipsis text-end text-xxs text-muted-foreground"
									>{position.title}</span
								>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	</Dialog.Content>
</Dialog.Root>

<div
	bind:this={diagramDiv}
	class="z-10 h-[calc(100vh-73px)] w-full max-w-[calc(100vw-9.45rem)] justify-center overflow-y-hidden"
/>
<div
	class="absolute bottom-2 left-14 z-30 flex cursor-default rounded-md text-xs text-muted-foreground/50"
>
	{#if $orgchartConfig.showNodeCount}
		{#if positions.length - 1 !== nodeCount}
			<div class="justify-start p-2 text-center">
				{nodeCount} nodes ({positions.length - 1 - nodeCount} hidden from orgchart)
			</div>
		{:else}
			<div class="justify-start p-2 text-center">
				{nodeCount} nodes
			</div>
		{/if}
	{/if}
</div>
