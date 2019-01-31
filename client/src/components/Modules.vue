<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <panel title="Modules">
          <v-data-table
            :headers="headers"
            :items="modules"
            class="elevation-0"
          >
            <template slot="items" slot-scope="props">
              <td >{{ props.item.moduleID }}</td>
              <td class="text-xs-right">{{ props.item.moduleName }}</td>
              <td class="text-xs-right">{{ props.item.moduleSemesterOffered }}</td>
              <td class="text-xs-right">{{ props.item.moduleECTS }}</td>
              <td class="text-xs-right">{{ props.item.moduleDepartment }}</td>
              <td class="text-xs-right">{{ props.item.moduleLocation }}</td>
            </template>
          </v-data-table>
        </panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ModulesService from '@/services/ModulesService'
import Panel from '@/components/Panel'
export default {
  components: {
    Panel
  },
  data () {
    return {
      headers: [
        {
          text: 'Module Code',
          align: 'left',
          sortable: false,
          value: 'moduleID'
        },
        { text: 'Module Title', value: 'moduleName' },
        { text: 'Offered Semester', value: 'moduleSemesterOffered' },
        { text: 'ECTS', value: 'moduleECTS' },
        { text: 'Department ', value: 'moduleDepartment' },
        { text: 'Location', value: 'moduleLocation' }
      ],
        modules: null
    }
  },
  async mounted () {
    // request the backend for all the songs
    this.modules = (await ModulesService.index()).data
  }
}
</script>

<style scoped>

</style>
