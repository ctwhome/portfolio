<script>
		import Youtube from "svelte-youtube-embed";
  	import Carousel from '$lib/components/ui/Carousel.svelte';
</script>

# Welcome to the full example for MDsveX with custom components!
Hi! I'm your first Markdown file in **Ctw Portfolio**.
Hi! I'm your first Markdown file in **Ctw Portfolio**.
Hi! I'm your first Markdown file in **Ctw Portfolio**.
Hi! I'm your first Markdown file in **Ctw Portfolio**.



Disabled Automaticaly display the TOC if the title exists: `## Contents`. Carefull! the document must start after with a # heading, otherwise everything will be replaced
<!-- # Contents -->


<Carousel/>
<Youtube id="OGSSvLnMwTc" />


<div class="diff aspect-[16/9] mt-10">
  <div class="diff-item-1">
    <div class="bg-primary text-primary-content text-9xl font-black grid place-content-center">CTW </div>
  </div>
  <div class="diff-item-2">
    <div class="bg-base-200 text-9xl font-black grid place-content-center">CTW</div>
  </div>
  <div class="diff-resizer"></div>
</div>

# header 1
## header 2
### header 3
#### header 4
##### header 5
###### header 6

## Code example
```ts
<script>
	import { page } from '$app/stores';
	import '$lib/assets/css/app.css';
	import Analytics from '$lib/components/Analytics.svelte';

	import TiltImage from '$components/TiltImage.svelte';
	import { content } from '$content/content';
	import ProfilePicture from '$components/ProfilePicture.svelte';

	// Find the specific post for the current slug
	const postPath = Object.keys(content).find(
		(path) => path.split('/').at(-2) === $page.params.slug
	);
	const post = content[postPath];
</script>

<Analytics />

<div class="max-w-3xl mx-auto px-3">
	<h1 class="mt-6 font-bold text-3xl sm:text-5xl">{@html post.metadata.title}</h1>

	<p class="text-sm mt-4 opacity-60">
		{#each post?.metadata?.categories as category}
			<span class="mx-1">{category}</span>
		{/each}
		-
		{new Date(post?.metadata?.date).toLocaleDateString('en-NL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}

		{#if post?.metadata?.tags?.length > 0}
			|
			{#each post?.metadata?.tags as tag}
				<span class="mx-1">{tag}</span>
			{/each}
		{/if}
	</p>

	<div class="mt-6 mb-12">
		<ProfilePicture />
	</div>
</div>
<div class="max-w-5xl mx-auto px-3">
	<TiltImage>
		<img
			class="object-cover rounded mx-auto"
			src={post?.metadata?.coverImage &&
				`/content/${$page.params.slug}/${post.metadata.coverImage}`}
			alt={post.slug}
		/>
	</TiltImage>

	<svelte:component this={post.default} />

	<a
		target="_blank"
		class="opacity-80"
		href={`https://github.com/ctwhome/portfolio/tree/main/src/content/${$page.params.slug}`}
		>Edit this page</a
	>
</div>
```

StackEdit stores your files in your browser, which means all your files are automatically saved locally and are accessible **offline!**

## Create files and folders
The file explorer is accessible using the button in left corner of the navigation bar. You can create a new file by clicking the **New file** button in the file explorer. You can also create folders by clicking the **New folder** button.

## Switch to another file
All your files and folders are presented as a tree in the file explorer. You can switch from one to another by clicking a file in the tree.

## Rename a file
You can rename the current file by clicking the file name in the navigation bar or by clicking the **Rename** button in the file explorer.

## Delete a file
You can delete the current file by clicking the **Remove** button in the file explorer. The file will be moved into the **Trash** folder and automatically deleted after 7 days of inactivity.

## Export a file

You can export the current file byki8 clicking **Export to disk** in the menu. You can choose to export the file as plain Markdown, as HTML using a Handlebars template or as a PDF.


# Synchronization

Synchronization is one of the biggest features of StackEdit. It enables you to synchronize any file in your workspace with other files stored in your **Google Drive**, your **Dropbox** and your **GitHub** accounts. This allows you to keep writing on other devices, collaborate with people you share the file with, integrate easily into your workflow... The synchronization mechanism takes place every minute in the background, downloading, merging, and uploading file modifications.

There are two types of synchronization and they can complement each other:

- The workspace synchronization will sync all your files, folders and settings automatically. This will allow you to fetch your workspace on any other device.
	> To start syncing your workspace, just sign in with Google in the menu.

- The file synchronization will keep one file of the workspace synced with one or multiple files in **Google Drive**, **Dropbox** or **GitHub**.
	> Before starting to sync files, you must link an account in the **Synchronize** sub-menu.

## Open a file

You can open a file from **Google Drive**, **Dropbox** or **GitHub** by opening the **Synchronize** sub-menu and clicking **Open from**. Once opened in the workspace, any modification in the file will be automatically synced.

## Save a file

You can save any file of the workspace to **Google Drive**, **Dropbox** or **GitHub** by opening the **Synchronize** sub-menu and clicking **Save on**. Even if a file in the workspace is already synced, you can save it to another location. StackEdit can sync one file with multiple locations and accounts.

## Synchronize a file

Once your file is linked to a synchronized location, StackEdit will periodically synchronize it by downloading/uploading any modification. A merge will be performed if necessary and conflicts will be resolved.

If you just have modified your file and you want to force syncing, click the **Synchronize now** button in the navigation bar.

> **Note:** The **Synchronize now** button is disabled if you have no file to synchronize.

## Manage file synchronization

Since one file can be synced with multiple locations, you can list and manage synchronized locations by clicking **File synchronization** in the **Synchronize** sub-menu. This allows you to list and remove synchronized locations that are linked to your file.


# Publication

Publishing in StackEdit makes it simple for you to publish online your files. Once you're happy with a file, you can publish it to different hosting platforms like **Blogger**, **Dropbox**, **Gist**, **GitHub**, **Google Drive**, **WordPress** and **Zendesk**. With [Handlebars templates](http://handlebarsjs.com/), you have full control over what you export.

> Before starting to publish, you must link an account in the **Publish** sub-menu.

## Publish a File

You can publish your file by opening the **Publish** sub-menu and by clicking **Publish to**. For some locations, you can choose between the following formats:

- Markdown: publish the Markdown text on a website that can interpret it (**GitHub** for instance),
- HTML: publish the file converted to HTML via a Handlebars template (on a blog for example).

## Update a publication

After publishing, StackEdit keeps your file linked to that publication which makes it easy for you to re-publish it. Once you have modified your file and you want to update your publication, click on the **Publish now** button in the navigation bar.

> **Note:** The **Publish now** button is disabled if your file has not been published yet.

## Manage file publication

Since one file can be published to multiple locations, you can list and manage publish locations by clicking **File publication** in the **Publish** sub-menu. This allows you to list and remove publication locations that are linked to your file.


# Markdown extensions

StackEdit extends the standard Markdown syntax by adding extra **Markdown extensions**, providing you with some nice features.

> **ProTip:** You can disable any **Markdown extension** in the **File properties** dialog.


## SmartyPants

SmartyPants converts ASCII punctuation characters into "smart" typographic punctuation HTML entities. For example:

|                |ASCII                          |HTML                         |
|----------------|-------------------------------|-----------------------------|
|Single backticks|`'Isn't this fun?'`            |'Isn't this fun?'            |
|Quotes          |`"Isn't this fun?"`            |"Isn't this fun?"            |
|Dashes          |`-- is en-dash, --- is em-dash`|-- is en-dash, --- is em-dash|


## KaTeX

You can render LaTeX mathematical expressions using [KaTeX](https://khan.github.io/KaTeX/):

The *Gamma function* satisfying $\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$ is via the Euler integral


> You can find more information about **LaTeX** mathematical expressions [here](http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference).


## UML diagrams

You can render UML diagrams using [Mermaid](https://mermaidjs.github.io/). For example, this will produce a sequence diagram:

```mermaid
sequenceDiagram
Alice ->> Bob: Hello Bob, how are you?
Bob-->>John: How about you John?
Bob--x Alice: I am good thanks!
Bob-x John: I am good thanks!
Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

Bob-->Alice: Checking with John...
Alice->John: Yes... John, how are you?
```

And this will produce a flow chart:

```mermaid
graph LR
A[Square Rect] -- Link text --> B((Circle))
A --> C(Round Rect)
B --> D{Rhombus}
C --> D
```
