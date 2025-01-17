<script lang="ts">
  import type { HelloProps } from "./types";
  export let name: HelloProps["name"];
</script>

<div class="text-lg">
  Hello {name}!
</div>
