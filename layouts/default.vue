<script lang="ts" setup></script>

<template>
  <div id="app-layout" class="w-full relative max-w-3xl mx-auto flex flex-col bg-white flex-1">
    <layout-the-nav-bar />
    <div class="px-5 pb-12">
      <slot />
    </div>
  </div>
</template>
