import { defineConfig } from 'vitepress'
import sidebar from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Auth Base documentation",
  description: "Documentation for Auth Base - Nest.js JWT auth library",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide/get-started' }
    ],

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/crucials/nest-auth-base' }
    ]
  },

  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'images/dark-logo.svg',
        media: '(prefers-color-scheme: light)'
      }
    ],

    [
      'link',
      {
        rel: 'icon',
        href: 'images/light-logo.svg',
        media: '(prefers-color-scheme: dark)'
      }
    ]
  ]
})
