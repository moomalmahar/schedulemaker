<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex mt-5  xs12>
        <full-calendar :config="config" :events="events"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  import SchedulesService from '@/services/SchedulesService'
  import $ from 'jquery'
  export default {
    name: 'hello',
    data () {
      return {
        events: [],
        modules:[],
        config: {
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,listWeek,listDay'
          },
          buttonText: {
            listWeek: 'week',
            listDay: 'day'
          },
          views: {
            agenda: {
              eventLimit: 2 // adjust to 6 only for agendaWeek/agendaDay
            }
          },
          defaultView: 'month',
          eventRender: function(event, element) {
          //  console.log(event)
          },
          eventClick: function(calEvent, jsEvent, view) {

            console.log('Event: ' + calEvent.detail);
           // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
           // alert('View: ' + view.name);

            // change the border color just for fun
            $(this).css('border-color', 'red');
          }
        },
      }
    }, async mounted () {
      // request the backend for all the songs
      this.modules = (await SchedulesService.index()).data
      // console.log(this.modules[0].moduleCode)
      for (let i =0;i<this.modules.length;i++){
        this.events.push ({
          start : this.modules[i].moduleStart,
          end : this.modules[i].moduleEnd,
          title : this.modules[i].moduleCode + "-" + this.modules[i].moduleTitle,
          allDay : false,
          selectable: true,
          detail: 'hey'
        })
      }
   //   console.log(this.events)
    }
  }
</script>

<style scoped>

</style>
