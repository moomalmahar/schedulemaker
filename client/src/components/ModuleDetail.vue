<template>
  <v-layout id="dy">
    <v-flex xs16>
      <panel title="Location">

        <v-layout align-center justify-center row fill-height>
          <v-text-field v-model="search" label="Search location here" required></v-text-field>
          <v-btn fab dark small color="primary" @click="searchLocation()" type="info">
            <v-icon dark>search</v-icon>
          </v-btn>
          <v-btn fab dark small @click="getLocation()" color="black">
            <v-icon dark>my_location</v-icon>
          </v-btn>
        </v-layout>
        <p>{{error}}</p>
        <v-alert icon="trip_origin" :value="alert" v-if="alert" type="info"> {{departure}}</v-alert>
        <v-alert icon="report" :value="!alert" type="error" v-else> Either Search for a location or get nearby stops
        </v-alert>
        <v-alert icon="location_on" :value="true" type="success">{{this.location}}</v-alert>
        <br>
        <div class="text-xs-right">
          <v-btn fab small :disabled="journeysbtn"  @click="getJourneys()" color="primary">
            <v-icon dark>done_all</v-icon>
          </v-btn>
          <v-btn fab dark small @click="clearLocations()" color="warning">
            <v-icon dark>clear_all</v-icon>
          </v-btn>
        </div>
        <v-divider vertical></v-divider>
        <br>
        <v-card style="margin-top: 20px" v-bind:key="key" v-for="(journey, key) in journeys">
          <v-card-actions v-bind:key="index" v-for="(legs, index) in journey.legs">
            {{legs.mode}} to {{legs.destination}}
            <br>
            {{legs.departure}} - {{legs.arrival}}
          </v-card-actions>
        </v-card>
      </panel>
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-data-table
            hide-actions
            :items="this.names.data"
            class="elevation-1 mt-4 mb-4">
            <template slot="items" slot-scope="props">
              <td @click="selectLocation(props.item.name, props.item.id)" class="text-xs-left">{{ props.item.name }}</td>
            </template>
          </v-data-table>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
  import {mapState} from 'vuex'
  import Panel from '@/components/Panel'
  import Journey from '@/services/JourneysService'
  export default {
    components: {
      Panel
    },
    data() {
      return {
        start: '',
        end: '',
        location: '',
        id: '',
        alert: false,
        journeysbtn: true,
        departure: '',
        error: '',
        searchterm: {
          search: ''
        },
        searchid: {
          id: '',
          arrival: ''
        },
        journeys: [],
        smallarray: {
          legs: {
            destination: '',
            departure: '',
            arrival: '',
            mode: ''
          }
        },
        names: [],
        coordinates: {
          lon: null,
          lat: null
        },
        dialog: false,
        search: null
      }
    },
    computed: {
      ...mapState([
        'route'
      ])
    },
    async mounted() {
      this.start = this.route.params.start
      this.end = this.route.params.end
      this.location = this.route.params.location
    },
    methods: {
      async getLocation () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition)
        } else {
          this.error = 'Geolocation is not supported.'
        }
        this.dialog = true
      },
      async showPosition (position) {
        try {
          this.coordinates.lat = position.coords.latitude
          this.coordinates.lon = position.coords.longitude
          this.names = await Journey.post(this.coordinates)
        } catch (err) {
          console.log(err)
        }
      },
      selectLocation (val, id) {
        try {
          this.departure = val
          this.id = id
          this.dialog = false
          this.alert = true
          this.journeysbtn = false
          this.names = []
        } catch (err) {
          console.log(err)
        }
      },
      async searchLocation () {
        try {
          this.searchterm.search = this.search
          this.names = await Journey.post(this.searchterm)
          this.dialog = true
        } catch (err) {
          console.log(err)
        }
      },
      async clearLocations () {
        try {
          this.alert = false
          this.journeysbtn = true
          this.id = ''
          this.search = ''
          this.departure = ''
          this.names = []
        } catch (err) {
          console.log(err)
        }
      },
      async getJourneys () {
        try {
          this.searchid.id = this.id
          this.searchid.arrival = this.start
          this.journeys = (await Journey.post(this.searchid)).data
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

