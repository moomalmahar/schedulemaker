<template>
  <v-layout id="dy">
    <v-flex xs16>
      <panel title="Location">
        <div id="e3"  class="grey lighten-3" >

          <v-card>
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-card color="blue-grey darken-2" class="white--text">
                    <v-card-title primary-title>
                      <div>
                        <span class="headline">Parse PDF Schedules</span>
                        <p><span>Add schedule file in folder and click the button below</span></p>
                      </div>
                    </v-card-title>
                    <v-card-actions>
                      <v-btn  @click="parsePDFs()" color="success">
                        Parse now
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </div>
      </panel>

    </v-flex>
  </v-layout>
</template>

<script>
  import Panel from '@/components/Panel'
  import Parser from '@/services/ParserService'

  export default {
    components: {
      Panel
    },
    methods: {
      async parsePDFs() {
        try {
          let schedules = (await Parser.post()).data
          console.log(schedules)
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>
<style scoped>
  #dy {
    margin-top: 50px;
  }
</style>
