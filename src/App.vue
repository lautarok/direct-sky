<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { v4 } from 'uuid';
</script>

<script lang="ts">
  sessionStorage.setItem('session_uuid', v4());
</script>

<template>
  <RouterView />
</template>