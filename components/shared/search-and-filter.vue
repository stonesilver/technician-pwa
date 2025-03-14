<script lang="ts" setup></script>

<template>
  <div class="mt-7 flex items-center gap-2">
    <div class="relative flex items-center flex-1">
      <Input type="search" placeholder="Search" class="pl-10" :prepend-icon="{ name: 'magnify' }" />
    </div>
    <div class="size-[46px] border-[0.73px] rounded center-item flex-shrink-0 bg-gray-50">
      <shared-icon name="filter" />
    </div>
  </div>
</template>
