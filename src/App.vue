<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col flex-shrink-1 flex-grow-0">
            <div class="card h-100" style="width: 300px;">
              <div class="card-body flex-shrink-1 flex-grow-0" style="padding-bottom: 0;">
                <h4 class="card-text text-monospace">Active Bots</h4>
              </div>
              <template v-if="connected">
                <bot-list :bots="botList" />
                <div class="col flex-fill" style="padding:15px">
                  <button class="btn btn-default btn-block" :disabled="processing" @click.prevent="closeConnection">
                    {{!processing ? 'Reset':'Closing Connection...'}}
                    <static-loader v-if="processing" width="18" height="18" />
                  </button>
                </div>
              </template>
              <div v-else class="flex-grow-1 text-left">
                <form class="col">
                <div class="form-group">
                  <label for="interval" class="text-monospace">Interval</label>
                  <input type="number" v-model="interval" class="form-control" id="interval" aria-describedby="intervaltext">
                  <small id="intervaltext" class="form-text text-muted">Communication update speed in milliseconds</small>
                </div>
                <div class="form-group">
                  <label for="robots" class="text-monospace">Number of Robots</label>
                  <input type="number" v-model="num_robots" class="form-control" id="robots" aria-describedby="robotstext">
                  <small id="robotstext" class="form-text text-muted">Number of Active Robots</small>
                </div>
                <button class="btn btn-primary btn-block" @click.prevent="initWebSocket" :disabled="processing">
                    {{!processing ? 'Initialize Websocket':'Initializing...'}}
                    <static-loader v-if="processing" width="18" height="18" />
                  </button>
                </form>
              </div>
            </div>
        </div>
        <div class="col">
          <canvas-wrapper :state="connected" class="center">
            <canvas-bots :bots="botList"></canvas-bots>
          </canvas-wrapper>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BotList from './components/BotList.vue'
import CanvasWrapper from './components/CanvasWrapper.vue'
import StaticLoader from './components/staticLoader.vue'
import CanvasBots from './components/CanvasBots.vue'

import WebSocket from './Socket.js'

export default {
    name: 'app',
    components: {
        BotList,
        CanvasWrapper,
        CanvasBots,
        StaticLoader,
    },
    data() {
        return {
            interval: 20,
            num_robots: 10,
            connected: false,
            processing: false,
            botHash: {},
        }
    },
    computed: {
        // Turn our hashmap of Robots into a sorted array
        botList() {
            return Object.values(this.botHash).sort((a, b) => (a.name > b.name ? 1 : -1))
        },
    },
    methods: {
        initWebSocket() {
            this.processing = true
            WebSocket.initConnection({
                onmessage: this.onmessage,
                onopen: () => {
                    this.processing = false
                    this.connected = true
                    console.log('socket opened')
                },
                onerror() {
                    alert('error opening socket')
                },
                onclose: () => {
                    this.connected = false
                    this.processing = false
                    this.botHash = {}
                    console.log('socket closed')
                },
                interval: this.interval,
                num_robots: this.num_robots,
            })
        },
        closeConnection() {
            // Use the processing state to prevent extra clicks on the UI.
            this.processing = true
            // This can take more than 10 seconds to finish closing for some reason... 
            WebSocket.closeConnection()
        },
        onmessage(msg) {
            let botMsg = JSON.parse(msg.data)
            // New bot, assign it a color and active state
            if (!this.botHash[botMsg.name]) {
                // assign new color
                botMsg.color = randomColor()
                botMsg.active = false
                // $set for creating a reactive property on an object
                this.$set(this.botHash, botMsg.name, botMsg)
            }
            // We've seen this bot before, just update it's values.
            // Use assign to keep the assigned color!
            else {
                Object.assign(this.botHash[botMsg.name], botMsg)
            }
        },
    },
    beforeDestroy() {
        WebSocket.closeConnection()
    },
}
function randomColor() {
    return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(
        Math.random() * 256
    )})`
}
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    padding: 30px 15px;
}
</style>
