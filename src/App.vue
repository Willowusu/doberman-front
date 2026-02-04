<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
let timeout = null;

// Function to kill the session on the server and move user to login
const handleLogout = async () => {
  try {
    await axios.post('/api/auth/logout');
  } catch (err) {
    console.error("Logout failed during idle timeout", err);
  } finally {
    router.push('/');
    // Use a custom modal or simple alert for the notification
    alert("Session expired due to inactivity for your protection.");
  }
};

const resetTimer = () => {
  if (timeout) clearTimeout(timeout);

  // Only start the timer if we are NOT on the login/verify pages
  const publicPages = ['/', '/verify'];
  if (publicPages.includes(window.location.pathname)) return;

  timeout = setTimeout(() => {
    handleLogout();
  }, 30 * 60 * 1000); // 30 minutes
};

onMounted(() => {
  // Setup listeners for user activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  events.forEach(event => {
    window.addEventListener(event, resetTimer);
  });

  resetTimer();
});

onUnmounted(() => {
  // Cleanup listeners if the App is ever unmounted
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  events.forEach(event => {
    window.removeEventListener(event, resetTimer);
  });
  if (timeout) clearTimeout(timeout);
});
</script>

<template>
  <router-view />
</template>

<style>
/* Global cleanup: Remove default Vite padding/centering */
#app {
  max-width: 100%;
  margin: 0;
  padding: 0;
  text-align: left;
}
</style>