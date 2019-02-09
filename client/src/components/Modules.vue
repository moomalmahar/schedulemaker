<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex mt-5  xs12>
        <panel  title="Modules">
          <v-data-table
            :headers="headers"
            :items="modules"
            class="elevation-1 mt-4 mb-4"
          >
            <template slot="items" slot-scope="props">
              <td v-if="props.item.isMyModule[0]" >
              <v-flex xs12 sm3><v-btn @click="removeCourse(props.item.id)" flat icon color="red"><v-icon>delete</v-icon></v-btn></v-flex>
              </td>
              <td v-else >
                <v-flex xs12 sm3><v-btn @click="addToCourse(props.item.id)" flat icon color="green"><v-icon>note_add</v-icon></v-btn></v-flex>
              </td>
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
  import UserModulesService from '@/services/UserModulesService'
  export default {
    components: {
      Panel
    },
    data () {
      return {
        modules: [],
        headers: [
          {
            align: 'left',
            sortable: false,
            value: 'moduleAdded'
          },
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
        ]
      }
    },
    async mounted () {
      // request the backend for all the songs
      this.modules = (await ModulesService.index()).data
    },
    methods: {
      async addToCourse (id) {
        try {
         const response = await UserModulesService.post({
            ModuleId: id,
            UserId: 1
          })
          this.modules = (await ModulesService.index()).data
        } catch (error) {
          this.error = error.response.data.error
        }
      },
    async removeCourse (id) {
      try {
        await UserModulesService.delete(id)
        this.modules = (await ModulesService.index()).data
      } catch (err) {
        console.log(err)
      }
    }
    }
  }
</script>

<style scoped>
</style>
