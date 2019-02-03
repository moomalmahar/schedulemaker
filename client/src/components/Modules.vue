<template>
  <div>
    <v-card-title>
      <v-toolbar-title>Modules </v-toolbar-title>
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
      :pagination.sync="pagination"
      :items="modules"
      :search="search"
    >
      <template slot="items" slot-scope="props">
        <td>
          <v-btn fab dark small color="red"><v-icon dark>remove</v-icon></v-btn>
          <v-btn fab dark small color="primary"><v-icon dark>add</v-icon></v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.moduleID }}</td>
        <td class="text-xs-right">{{ props.item.moduleName }}</td>
        <td class="text-xs-right">{{ props.item.moduleSemesterOffered }}</td>
        <td class="text-xs-right">{{ props.item.moduleECTS }}</td>
        <td class="text-xs-right">{{ props.item.moduleDepartment }}</td>
        <td class="text-xs-right">{{ props.item.moduleLocation }}</td>

      </template>
    </v-data-table>
  </div>
</template>

<script>
  import ModulesService from '@/services/ModulesService'
  import Panel from '@/components/Panel'

  export default {
    components: {
      Panel
    },
    data() {
      return {
        search: '',
       modules: [],
        pagination: {
          sortBy: 'createdAt',
          descending: true
        },
        headers: [
          {text: '', value: ''},
          {text: 'Module Code', value: 'moduleID'},
          {text: 'Module Name', value: 'moduleName'},
          {text: 'Semester Offered', value: 'moduleSemesterOffered'},
          {text: 'ECTS', value: 'moduleECTS'},
          {text: 'Department', value: 'moduleDepartment'},
          {text: 'Offered At', value: 'moduleLocation'}
        ]
      }

    },
    async mounted() {
      // request the backend for all the songs
      this.modules = (await ModulesService.index()).data
    },
    methods: {
      addtolist (val){
      console.log("came here")
        console.log(val)
      }
    }
  }
</script>

<style scoped>

</style>
