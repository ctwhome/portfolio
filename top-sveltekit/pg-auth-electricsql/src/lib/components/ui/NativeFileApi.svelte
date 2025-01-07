<!--
  Access to native file system selector with Vue.
  @author J.Gonzalez @ctwhome
-->
<script lang="ts">
	import { deleteDB, openDB } from 'idb';
	import { onMount } from 'svelte';

	let numberFiles = $state({ rootName: '', directories: 0, files: 0 });
	let loadingFiles = false;
	let db = null;
	let arrayTree = [];
	let tree = $state({});
	// Object.keys(tree).length !== 0
	onMount(async () => {
		// Create DB in indexDB
		db = await openDB('db', 1, {
			upgrade(db) {
				db.createObjectStore('store');
			}
		});
		const directoryHandle = await db.get('store', 'directory');
		console.log('🔌 directoryHandle', directoryHandle);
		/* Timeout to avoid user activation error. */
		if (directoryHandle) {
			await directoryHandle.requestPermission();
			await recursive(directoryHandle);
			console.log('🌲 tree:', tree);
		}
	});

	async function cleanDB() {
		// db.close()
		tree = {};
		await deleteDB('db');
	}

	async function fileClicked(fileHandle) {
		console.log('📂 fileClicked', fileHandle);
		try {
			if (fileHandle.handle.kind === 'file') {
				const file = await fileHandle.handle.getFile();
				console.log('🎹', file);
				let content = await file.text();
				if (file.type === 'application/json') {
					content = JSON.parse(content);
				}
				console.log('🎹', content);
				// console.log('🎹 file', file)
			}
		} catch (e) {
			console.log('🎹 error', e);
		}
	}

	async function open() {
		try {
			const directoryHandle = await window.showDirectoryPicker();
			console.log('📁 directoryHandle', directoryHandle);
			loadingFiles = true;
			tree = {};
			numberFiles = { rootName: '', directories: 0, files: 0 };
			// Save handle locally so the files loads on refresh
			db.put('store', directoryHandle, 'directory');

			await recursive(directoryHandle);

			loadingFiles = false;
		} catch (e) {
			loadingFiles = false;
			console.error(e);
		}
	}

	/**
	 * Read recursively all files and subdirectories
	 */
	async function recursive(directoryHandle, path = '/') {
		try {
			for await (const [name, handle] of directoryHandle) {
				if (handle.kind === 'directory') {
					numberFiles.directories++;
					// if item is a directory enter to the folder
					await recursive(handle, path + name + '/');
				} else {
					numberFiles.files++;
				}
				// Make vue reactive when changing the object ==> tree[path + name] = { name, handle }
				// $set(tree, path + name, { name, handle })
				tree[path + name + '/'] = { name, handle };
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div>
	<h2>Access to the native file system API</h2>
	<!--  <p>-->
	<!--    The File System Access API allows web apps to read or save changes-->
	<!--    directly to files and folders on the user's device.-->
	<!--    <a href="https://web.dev/file-system-access/" target="_blank">-->
	<!--      Read the blog-->
	<!--    </a>-->
	<!--  </p>-->
	<!--  <p>-->
	<!--    This component stores the binary object into indexDB to have access to the-->
	<!--    file system when reloading. The user needs to grand access once again.-->
	<!--  </p>-->

	<div class="btn" onclick={open}>Open directory</div>
	<div>
		<pre>{JSON.stringify(numberFiles, null, 2)}</pre>
		{#each Object.values(tree) as { name, handle }}
			<div class="hover:bg-gray-500 cursor-pointer" onclick={() => fileClicked(handle)}>
				{name}
			</div>
			<!--      <div>{item[0]} -  <pre>{JSON.stringify(item[1], null, 2)}</pre>{item[1]}</div>-->
			<!--      <div class="flex">-->
			<!--        <div class="w-1/4">-->
			<!--          {item.name}-->
			<!--        </div>-->
			<!--        <div class="w-1/4">-->
			<!--          {item.handle?.kind}-->
			<!--        </div>-->
			<!--        <div class="w-1/4">-->
			<!--          {item.handle?.type}-->
			<!--        </div>-->
			<!--        <div class="w-1/4">-->
			<!--          {item.handle?.size}-->
			<!--        </div>-->
			<!--      </div>-->
		{/each}
		<pre>{JSON.stringify(tree, null, 2)}</pre>
	</div>
	<!-- <v-card class="pa-4" outlined>
     <div class="d-flex">
       <v-btn
           depressed
           :color="isTreeEmpty ? 'default' : 'primary'"
           :loading="loadingFiles"
           @click="open"
       >
         Open directory
       </v-btn>
       <div v-if="isTreeEmpty" class="d-flex">
         <template>
           <v-row no-gutters justify="center" class="mx-6">
             <v-dialog v-model="dialog" scrollable max-width="600px">
               <template v-slot:activator="{ on, attrs }">
                 <v-hover>
                   <div v-bind="attrs" class="mt-1" v-on="on">
                     <v-icon color="blue lighten-3">{{ mdiFolder }}</v-icon>
                     {{ numberFiles.directories }}
                     <v-icon color="blue lighten-3"
                     >{{ mdiFileDocumentOutline }}
                     </v-icon>
                     {{ numberFiles.files }}
                   </div>
                 </v-hover>
               </template>
               <v-card>
                 <v-card-title>Opened files and directories</v-card-title>
                 <v-divider></v-divider>
                 <v-card-text>
                   <div
                       v-for="(item, key) in tree"
                       :key="key"
                       class="item"
                       @click="fileClicked(item)"
                   >
                     {{ key }}
                     <v-icon color="blue lighten-3">
                       {{
                         item.handle.kind === 'file'
                           ? mdiFileDocumentOutline
                           : mdiFolder
                       }}
                     </v-icon>
                     {{ item.name }}
                   </div>
                 </v-card-text>
                 <v-divider></v-divider>
                 <v-card-actions>
                   <v-btn color="blue darken-1" text @click="dialog = false">
                     Close
                   </v-btn>
                 </v-card-actions>
               </v-card>
             </v-dialog>
           </v-row>
         </template>

         <v-btn icon @click="cleanDB">
           <v-icon>{{ mdiClose }}</v-icon>
         </v-btn>
       </div>
     </div>
   </v-card>-->
</div>
