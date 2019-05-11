<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex mt-5 xs12>
        <div>
            <full-calendar  @event-selected="eventClick":config="config" :events="events" ref="calendar"/>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import SchedulesService from '@/services/SchedulesService'
  export default {
    data() {
      return {
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        events: [],
        modules: [],
        config: {
          minTime: "07:00:00",
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,listWeek,listDay'
          },
          height: "auto",
          buttonText: {
            listWeek: 'week',
            listDay: 'day'
          },
          defaultView: 'listWeek'
        },
      }
    }, async mounted() {
      // request the backend for all the schedules
      this.modules = (await SchedulesService.index()).data
      // console.log(this.modules[0].moduleCode)
      for (let i = 0; i < this.modules.length; i++) {
        this.events.push({
          start: this.modules[i].moduleStart,
          end: this.modules[i].moduleEnd,
          title: this.modules[i].moduleTitle,
          allDay: false,
          selectable: true,
          detail: this.modules[i].moduleUniversity
        })
      }
      // console.log(this.events)
    },
    methods: {
      eventClick: function (calEvent, jsEvent, view) {
        console.log(new Date(calEvent.start._i));
        let routeData =  this.$router.resolve({
          name: 'module-view',
          params: {
            start: calEvent.start._i,
            end: calEvent.end._i,
            location: calEvent.detail }
        })
        window.open(routeData.href, '_blank');
      }
    }
  }
</script>
<style scoped>

</style>
