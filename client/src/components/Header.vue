<template>
  <v-toolbar fixed dark  class="cyan">
    <v-toolbar-title class="mr-4">
      <span class="home" flat dark @click="navigateTo('/')">Schedule Maker</span>
      </v-toolbar-title>
    <v-toolbar-items><v-btn flat dark router to="songs">Browse</v-btn></v-toolbar-items>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: '/'
      })
    }
  }

}
</script>

<style scoped>
.home{
  cursor: pointer;
}
</style>
