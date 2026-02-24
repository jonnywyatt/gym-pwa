import { defineConfig } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[64, 'favicon.ico']],
    },
    maskable: {
      sizes: [512],
      // padding: 0 ensures the dark background fills the full icon with no white border
      padding: 0,
    },
    apple: {
      sizes: [180],
    },
  },
  images: ['public/logo.svg'],
});
