<template>
  <div v-if="toc.length > 0" class="bg-base-200 py-3 px-5 max-w-max ">
    <div class="font-bold">
      Table of Contents
    </div>
    <ol class="text-sm">
      <li
        v-for="link of toc"
        :key="link.id"
      >
        <NuxtLink :to="`#${link.id}`" class="text-md">
          {{ link.text }}
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>
<script>
export default {
  props: {
    toc: {
      type: Array,
      required: true
    }
  }
}
</script>
