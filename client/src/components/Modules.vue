<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex mt-5 xs12>
        <div v-if="this.locationclash.length > 0">
          <v-alert :value="true" type="info">
            You have {{this.locationclash.length}} location clash(es)
            <v-btn small @click="seeLocationClashes()" color="white">See clashes</v-btn>
          </v-alert>
          <!--<ul v-for="(item, index) in this.clash">
          </ul>-->
        </div>
        <div v-if="this.clash.length > 0">
          <v-alert :value="true" type="warning">
            You have {{this.clash.length}} schedule clash(es)
            <v-btn @click="seeClashes()" small color="white">See clashes</v-btn>
          </v-alert>
          <!--<ul v-for="(item, index) in this.clash">
          </ul>-->
        </div>
        <panel title="Modules">
          <v-data-table
            :headers="headers"
            :items="modules"
            class="elevation-1 mt-4 mb-4">
            <template slot="items" slot-scope="props">
              <td v-if="props.item.isMyModule[0]">
                <v-flex xs12 sm3>
                  <v-btn @click="removeCourse(props.item.id)" flat icon color="red">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
              </td>
              <td v-else>
                <v-flex xs12 sm3>
                  <v-btn @click="addToCourse(props.item.id)" flat icon color="green">
                    <v-icon>note_add</v-icon>
                  </v-btn>
                </v-flex>
              </td>
              <td>{{ props.item.moduleCode }}</td>
              <td class="text-xs-right">{{ props.item.moduleTitle }}</td>
            </template>
          </v-data-table>
        </panel>
        <v-dialog v-if="this.clash.length > 0" v-model="classdialog" persistent>
          <v-card>
            <v-data-table
              hide-actions
              :headers='clashheaders'
              :items="this.clash"
              class="elevation-1 mt-4 mb-4">
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.clashWithTitle }}
                </td>
                <td>{{props.item.clashWithStart}}
                </td>
                <td>{{props.item.moduleTitle}}
                </td>
                <td>{{props.item.moduleStart}}
                </td>
                <td></td>
              </template>
            </v-data-table>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="classdialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-if="this.locationclash.length > 0" v-model="locationdialog" persistent>
          <v-card>
            <v-data-table
              hide-actions
              :headers='locationheaders'
              :items="this.locationclash"
              class="elevation-1 mt-4 mb-4">
              <template slot="items" slot-scope="props">
                <td class="text-xs-left"><b>{{ props.item.clashWithCode }}</b> - {{ props.item.clashWithTitle }}
                </td>
                <td>{{props.item.departureUniversity}}
                </td>
                <td><b>{{ props.item.moduleCode }}</b> - {{props.item.moduleTitle}}
                </td>
                <td>{{props.item.destinationUniversity}}
                </td>
                <td>{{props.item.timeDifference}}
                </td>
                <td>{{props.item.clashWithStart}}
                </td>
                <td></td>
              </template>
            </v-data-table>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="locationdialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
    data() {
      return {
        modules: [],
        classdialog: false,
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
          {text: 'Module Title', value: 'moduleCode'},
        ],
        clashheaders: [
          {
            text: 'Module Code',
            align: 'left',
            sortable: false,
            value: 'clashWith'
          },
          {
            text: 'At',
            align: 'left',
            sortable: false,
            value: 'moduleCode'
          },
          {
            text: 'With',
            align: 'left',
            sortable: false,
            value: 'moduleCode'
          },
          {
            text: 'On',
            align: 'left',
            sortable: false,
            value: 'moduleCode'
          }
        ],
        locationheaders: [
          {
            text: 'Clash with',
            align: 'left',
            sortable: false,
            value: 'clashWith'
          },
          {
            text: 'From',
            align: 'left',
            sortable: false,
            value: 'moduleCode'
          },
          {
            text: 'Module',
            align: 'left',
            sortable: false,
            value: 'clashWith'
          },
          {
            text: 'To',
            align: 'left',
            sortable: false,
            value: 'moduleCode'
          },
          {
            text: 'Reach in (minutes)',
            align: 'left',
            sortable: false,
            value: 'moduleCode'
          },
          {
            text: 'On',
            align: 'left',
            sortable: false,
            value: 'clashWith'
          }
        ],
        locationdialog: false
      }
    },
    async mounted() {
      // request the backend for all the modules and clashes
      this.modules = (await ModulesService.index()).data
      this.clash = (await UserModulesService.index()).data.clashes
      this.locationclash = (await UserModulesService.index()).data.locationclashes
    },
    methods: {
      seeClashes(){
        this.classdialog = true
      },
      seeLocationClashes(){
        this.locationdialog = true
      },
      async addToCourse(id) {
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
      async removeCourse(id) {
        try {
          await UserModulesService.delete(id)
          this.modules = (await ModulesService.index()).data
          this.clash = (await UserModulesService.index()).data.clashes
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
