<script>
// Templateless function that draws on the canvas during its render cycle
export default {
    // Gets us the provider property from the parent component.
    inject: ['provider'],
    props: {
        bots: Array,
    },
    created() {
        // Remember each bot's last location with a hash map
        // use created() lifecycle hook to make a non-reactive object
        this.lastPath = {}
    },
    watch: {
        // Watch the array to make sure it gets cleared when reset
        bots: function(val) {
            if (!val.length) this.lastPath = {}
        },
    },
    render() {
        // Don't render if the canvas isn't available
        if (!this.provider.canvasContext) return

        // Fade the canvas so the movement trails away. Good to show movement over time
        // Would be good if this were tied to the update interval
        this.provider.fadeCanvas(0.009)
        this.provider.clearOverlay()

        this.bots.forEach(bot => {
            let { x, y } = { ...bot }
            // Stroke the line from last-location to this location
            // If the server is skipping spots, gives you a diagonal line
            if (this.lastPath[bot.name]) {
                drawLine({x,y}, this.lastPath[bot.name], bot.color, this.provider.canvasContext)
            }
            // Remember the new last path
            this.lastPath[bot.name] = { x, y }

            // The user has hovered an item on the list, light the beacon!
            if (bot.active && this.provider.overlayContext) {
                drawArrow(bot, this.provider.overlayContext)
            }
        })
    },
}

// Destructure and rename last {x,y} pair as lx and ly
function drawLine({x,y}, {x: lx, y: ly}, color, ctx){
    // remove the reactivity!!
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.moveTo(lx, ly)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.restore()
}

// draw an arrow/teardrop shape to highlight the robot's location and direction
function drawArrow(bot, otx) {
    const { x, y } = { ...bot }
    const w = 5, h = 8

    // Better than a switch statement if you don't need a default function,
    // at the cost of a little more heap space
    const drawCompass = {
        'N': () => {
            otx.arc(x, y, 5, 0, 1 * Math.PI, false)
            otx.moveTo(x - w, y)
            otx.lineTo(x, y - h)
            otx.lineTo(x + w, y)
        },
        'E': () => {
            otx.arc(x, y, 5, 0.5 * Math.PI, 1.5 * Math.PI, false)
            otx.moveTo(x, y - w)
            otx.lineTo(x + h, y)
            otx.lineTo(x, y + w)
        },
        'S': () => {
            otx.arc(x, y, 5, 1 * Math.PI, 2 * Math.PI, false)
            otx.moveTo(x - w, y)
            otx.lineTo(x, y + h)
            otx.lineTo(x + w, y)
        },
        'W': () => {
            otx.arc(x, y, 5, 1.5 * Math.PI, 0.5 * Math.PI, false)
            otx.moveTo(x, y - w)
            otx.lineTo(x - h, y)
            otx.lineTo(x, y + w)
        },
    }

    otx.save()
    otx.beginPath()
    drawCompass[bot.direction]()

    otx.fillStyle = bot.color
    otx.fill()
    otx.strokeStyle = 'black'
    otx.stroke()
    otx.restore()
}
</script>

