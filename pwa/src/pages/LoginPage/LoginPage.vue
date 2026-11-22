<script setup lang="ts">
import { authService } from '../../lib/auth/oauth';
import styles from './LoginPage.module.css';
import duroLogo from '../../assets/duro-logo.svg';
import dashboardScreenshot from '/screenshot-dashboard.svg';
import muscleGroupTrendsScreenshot from '/screenshot-muscle-group-trends.svg';
import sessionTrendsScreenshot from '/screenshot-session-trends.svg';

const featureSlides = [
  {
    image: dashboardScreenshot,
    alt: 'Duro dashboard showing recent sessions and progress',
    heading: 'Build a gym habit',
    body: ['Duro\'s home screen emphasises regular training, not how heavy you\'re lifting, which is the key to building a gym habit that lasts.'],
    reverse: false,
  },
  {
    image: sessionTrendsScreenshot,
    alt: 'Duro session trends chart showing lift progress over time',
    heading: 'Watch your strength climb',
    body: ['If you focus on session frequency, and push close to your limit while avoiding injury, then the strength gains will follow.'],
    reverse: false,
  },
  {
    image: muscleGroupTrendsScreenshot,
    alt: 'Duro muscle group breakdown chart',
    heading: 'Train smarter, not lopsided',
    body: ['Spot which muscle groups are getting the love, and which ones need more.'],
    reverse: true,
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
        </div>
        <img :src="slide.image" :alt="slide.alt" :class="styles.slideImage" />
      </section>
    </main>
  </div>
</template>
