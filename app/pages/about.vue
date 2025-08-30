<template>
  <div class="about">
    <AppHeader />
    <PageContainer>
      <BaseCard>
        <h1>About FlexForm</h1>
        <p>This is a flexible form builder application built with Nuxt.js.</p>
        <p>Features include:</p>
        <ul>
          <li>Dynamic form creation</li>
          <li>Public form submission</li>
          <li>Form management</li>
        </ul>
      </BaseCard>
    </PageContainer>
  </div>
</template>

<script setup lang="ts">
// Simple about page for testing purposes
</script>

<style scoped>
.about {
  min-height: 100vh;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

ul {
  list-style-type: disc;
  padding-left: 2rem;
}
</style>
