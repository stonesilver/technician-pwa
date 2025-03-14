<script setup lang="ts">
import type { IconProps } from "~/types"

const props = defineProps<IconProps>()

let Svg = ref<string>("")

const fetchXFormatSvg = () => {
  const { className } = props
  try {
    const modules: any = {
      svg: import.meta.glob("../../assets/icons/*", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
    }

    const iconString = modules.svg[`../../assets/icons/${props.name}.svg`]
    if (typeof window !== "undefined") {
      const parser = new DOMParser()
      const svg = parser.parseFromString(iconString, "image/svg+xml")
      const svgEl = svg.getElementsByTagName("svg")[0]
      if (!svgEl) {
        return (Svg.value = `<span class='text-xl'>🎧</span>`)
      }

      className && svgEl.setAttribute("class", className)

      const string = new XMLSerializer()
      Svg.value = string.serializeToString(svg)
    }
  } catch (error) {}
}

watch(() => props, fetchXFormatSvg, { deep: true, immediate: true })
</script>

<template>
  <span class="block max-w-fit" v-html="Svg"></span>
</template>
