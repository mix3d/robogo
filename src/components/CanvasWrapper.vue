<template>
  <div class="card h-100">
    <div class="canvas-wrapper mx-auto">
      <canvas class="mx-auto" ref="canvas-overlay" width=500 height=500></canvas>
      <canvas class="mx-auto" ref="canvas" width=500 height=500></canvas>

    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
      state: Boolean,
  },
  data() {
    return {
      // By creating the provider in the data property, it becomes reactive,
      // so child components will update when `context` changes.
      provider: {
        // This is the CanvasRenderingContext that children will draw to.
        canvasContext: null,
        overlayContext: null,
      }
    }
  },

  // Allows any child component to `inject: ['provider']` and have access to it.
  provide () {
    return {
      provider: this.provider
    }
  },
  watch: {
    // Clear Canvas if connection state changes
    state: function (val) {
      this.provider.fadeCanvas(1);
      this.provider.clearOverlay();
    },
  },
  mounted () {
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    // no alpha for faster drawing
    this.provider.canvasContext = this.$refs['canvas'].getContext('2d',{ alpha: false })
    this.provider.overlayContext = this.$refs['canvas-overlay'].getContext('2d')

    this.provider.fadeCanvas = (amt) =>{
        let {width, height} = this.$refs['canvas'];
        this.provider.canvasContext.fillStyle = `rgba(255,255,255,${amt})`;
        this.provider.canvasContext.fillRect(0, 0, width, height);
    }
    this.provider.clearOverlay = () =>{
        let {width, height} = this.$refs['canvas-overlay'];
        this.provider.overlayContext.clearRect(0, 0, width, height);
    }

    // fill once white to start
    this.provider.fadeCanvas(1)

    // Resize the canvas to fit its parent's width.
    // Normally you'd use a more flexible resize system.
    // this.$refs['canvas'].width = this.$refs['canvas'].parentElement.clientWidth
    // this.$refs['canvas'].height = this.$refs['canvas'].parentElement.clientHeight
  }
}
</script>

<style lang="scss">
.canvas-wrapper{
  position: relative;
  min-height: 500px;
  canvas:first-child{
    z-index:10;
  }
  canvas{
      position: absolute;
      top:0;left:50%;
      transform: translate(-50%,0%);
  }
}
</style>
