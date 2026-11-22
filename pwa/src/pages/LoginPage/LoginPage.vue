<script setup lang="ts">
import { authService } from '../../lib/auth/oauth';
import styles from './LoginPage.module.css';
import duroLogo from '../../assets/duro-logo.svg';
import dashboardScreenshot from '/screenshot-dashboard.svg';
import muscleGroupTrendsScreenshot from '/screenshot-muscle-group-trends.svg';
import sessionTrendsScreenshot from '/screenshot-session-trends.svg';
import pwaIcon from '/pwa-512x512.png';
import InstallPrompt from '../../components/InstallPrompt/InstallPrompt.vue';

interface FeatureSlide {
  image: string;
  alt: string;
  heading: string;
  body: string[];
  reverse: boolean;
  install?: boolean;
}

const featureSlides: FeatureSlide[] = [
  {
    image: dashboardScreenshot,
    alt: 'Dashboard showing recent sessions and progress',
    heading: 'A mobile app for building a gym habit',
    body: ['Duro\'s home screen emphasises regular training, not how heavy you\'re lifting.', 'Cadence is the key to building a gym habit that lasts.'],
    reverse: false,
  },
  {
    image: sessionTrendsScreenshot,
    alt: 'Session trends chart showing lift progress over time',
    heading: 'Track weight moved per session',
    body: ['If you focus on session frequency, and push close to your limit while avoiding injury, then the strength gains will follow.'],
    reverse: false,
  },
  {
    image: muscleGroupTrendsScreenshot,
    alt: 'Muscle group breakdown chart',
    heading: 'Balance your training',
    body: ['Track which muscle groups are getting the attention, and which ones need more.'],
    reverse: true,
  },
  {
    image: pwaIcon,
    alt: 'Duro app icon',
    heading: 'Take Duro with you',
    body: ['Add Duro to your mobile home screen for the full app experience. No app store needed.'],
    reverse: false,
    install: true,
  },
];

function handleLogin() {
  authService.initiateLogin();
}
</script>

<template>
  <div :class="styles.homePage">
    <header :class="[styles.homeHeader, 'flexSpaceBetween']">
      <span :class="styles.brandLogo">
        <img :src="duroLogo" alt="Duro" width="117" height="26" />
      </span>
      <button @click="handleLogin" class="buttonPrimary">Sign in with Google</button>
    </header>

    <main :class="styles.slides">
      <section
        v-for="slide in featureSlides"
        :key="slide.heading"
        :class="[styles.slide, slide.reverse ? styles.slideReverse : null]"
      >
        <div :class="styles.slideCopy">
          <h2 :class="[styles.slideHeading, 'heading', 'heading-m']">{{ slide.heading }}</h2>
          <p
            v-for="paragraph in slide.body"
            :key="paragraph"
            :class="[styles.slideSubheading, 'textSecondary']"
          >{{ paragraph }}</p>
          <InstallPrompt v-if="slide.install" />
        </div>
        <img :src="slide.image" :alt="slide.alt" :class="styles.slideImage" />
      </section>
    </main>
  </div>
</template>
