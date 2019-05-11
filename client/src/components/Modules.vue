<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex mt-5  xs12>
        <div v-if="this.locationclash.length > 0" >
          <v-alert  :value="true" type="info">
            You have {{this.locationclash.length}} location clash(es)
          </v-alert>
          <!--<ul v-for="(item, index) in this.clash">
          </ul>-->
        </div>
        <div v-if="this.clash.length > 0" >
          <v-alert  :value="true" type="warning">
            You have {{this.clash.length}} schedule clash(es)
          </v-alert>
          <!--<ul v-for="(item, index) in this.clash">
          </ul>-->
        </div>
        <panel  title="Modules">
          <v-data-table
            :headers="headers"
            :items="modules"
            class="elevation-1 mt-4 mb-4">
            <template slot="items" slot-scope="props">
              <td v-if="props.item.isMyModule[0]" >
              <v-flex xs12 sm3><v-btn @click="removeCourse(props.item.id)" flat icon color="red"><v-icon>delete</v-icon></v-btn></v-flex>
              </td>
              <td v-else >
                <v-flex xs12 sm3><v-btn @click="addToCourse(props.item.id)" flat icon color="green"><v-icon>note_add</v-icon></v-btn></v-flex>
              </td>
              <td>{{ props.item.moduleCode }}</td>
              <td class="text-xs-right">{{ props.item.moduleTitle }}</td>
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
        clash: '',
        locationclash: '',
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
            value: 'moduleCode'
          },
          { text: 'Module Title', value: 'moduleCode' },
        ]
      }
    },
    async mounted () {
      // request the backend for all the modules and clashes
      this.modules = (await ModulesService.index()).data
      this.clash = (await UserModulesService.index()).data.clashes
      this.locationclash = (await UserModulesService.index()).data.locationclashes
    },
    methods: {
      async addToCourse (id) {
        try {
         await UserModulesService.post({
            ModuleId: id,
            UserId: 1
          })
          this.modules = (await ModulesService.index()).data

          this.clash = (await UserModulesService.index()).data.clashes
          this.locationclash = (await UserModulesService.index()).data.locationclashes
        } catch (error) {
          this.error = error.response.data.error
        }
      },
    async removeCourse (id) {
      try {
        await UserModulesService.delete(id)
        this.modules = (await ModulesService.index()).data
        console.log(this.clash)
        this.locationclash = (await UserModulesService.index()).data.locationclashes
      } catch (err) {
        console.log(err)
      }
    }
    }
  }
</script>

<style scoped>
</style>
