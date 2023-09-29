<template>
    <Layout>
        <template #home-hero-image>
            <Transition name="growing" appear>
                <img :src="frontmatter.hero.image.dark" :alt="frontmatter.hero.image.alt"
                    v-if="pageData.isDark.value"
                    class="VPImage dark image-src">

                <img :src="frontmatter.hero.image.light" :alt="frontmatter.hero.image.alt" v-else
                    class="VPImage light image-src">
            </Transition>
        </template>
    </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { provide, nextTick } from 'vue'

const { Layout } = DefaultTheme

const pageData = useData()
const frontmatter = pageData.frontmatter

const { isDark } = pageData

/*
    i havent learnt view transitions api so idk how is that code working
    cool circle-mask theme switch animation tho
*/
type ViewTransitionsDocument = Document & {
    startViewTransition : (start : (event: MouseEvent) => Promise<void>) => { ready: Promise<any> }
}

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await (document as ViewTransitionsDocument).startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'linear',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})
</script>

<style scoped>
.growing-enter-from, .growing-leave-to {
    scale: 0;
}

::view-transition-old(root), ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
    z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
    z-index: 9999;
}
</style>