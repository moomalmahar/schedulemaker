<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex mt-5  xs12>

          <v-card>
            <v-card-title>
              <v-toolbar-title>Modules</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="modules"
              :search="search"
            >
              <template slot="items" slot-scope="props">
                <td hide-details >
                  <v-flex xs12 sm3><v-btn @click="removeCourse(props.item.id)" flat icon color="red"><v-icon>delete</v-icon></v-btn></v-flex>
                </td>
                <td class="text-xs-right">{{ props.item.moduleCode }}</td>
                <td class="text-xs-right">{{ props.item.moduleTitle }}</td>

              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
              </v-alert>
            </v-data-table>
          </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import UserModulesService from '@/services/UserModulesService'
  import Panel from '@/components/Panel'

  export default {
    components: {
      Panel
    },
    data() {
      return {
        error: null,
        search: '',
        modules: [],
        pagination: {
          sortBy: 'createdAt',
          descending: true
        },
        headers: [
          {text: '', value: '',sortable: false},
          {text: 'Module Code', value: 'moduleCode',sortable: false},
          {text: 'Module Title', value: 'moduleTitle'},
        ]
      }

    },
    async mounted() {
      // request the backend for all the songs
      this.modules = (await UserModulesService.index()).data
    },
    methods: {
      async removeCourse (id) {
        try {
          await UserModulesService.delete(id)
          this.modules = (await UserModulesService.index()).data
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>

<style scoped>

</style>
