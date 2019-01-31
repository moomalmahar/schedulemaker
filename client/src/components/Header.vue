<template>
  <v-toolbar fixed dark  class="cyan">
    <v-toolbar-title class="mr-4">
      <span class="home" flat dark @click="navigateTo('/')">Schedule Parser</span>
      </v-toolbar-title>

    <v-spacer></v-spacer>
    <v-toolbar-items><v-btn v-if="!$store.state.isUserLoggedIn" flat dark router to="login">Login</v-btn></v-toolbar-items>
    <v-toolbar-items><v-btn v-if="!$store.state.isUserLoggedIn" flat dark router to="register">SIGN UP</v-btn></v-toolbar-items>
    <v-toolbar-items><v-btn v-if="$store.state.isUserLoggedIn" flat dark @click="logout" >Log Out</v-btn></v-toolbar-items>
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
