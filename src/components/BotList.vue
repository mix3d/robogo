<template>
    <div class="list-group list-group-flush flex-grow-1">
        <!-- Probably not the best design pattern for a child item to change the items it is given, but it works! Thanks Vue reactivity! -->
        <div class="list-group-item"
          v-for="bot in bots"
          :key="bot.name"
          v-on:mouseover="bot.active = true"
          v-on:mouseleave="bot.active = false"
          :style="{'box-shadow': 'inset 6px 0 0 0 ' + bot.color}">
          <strong>{{bot.name}}</strong>
          <p class="card-text small text-monospace">Direction: {{bot.direction}},
            Location: {{locationString(bot)}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BotList',
    props: {
        bots: Array,
    },
    methods: {
        locationString: (bot) => `{${bot.x},${bot.y}}`,
    },
    computed: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list-group {
    overflow-y: auto;
    // padding-bottom: .25rem;
    max-height: 480px;

    // Scroll style on chrome, but not FF
    &::-webkit-scrollbar {
        width: 8px; /* 1px wider than Lion. */
        /* This is more usable for users trying to click it. */
        background-color: rgba(0, 0, 0, 0);
        border-radius: 100px;
    }
    /* hover effect for both scrollbar area, and scrollbar 'thumb' */
    &::-webkit-scrollbar:hover {
        background-color: rgba(0, 0, 0, 0.09);
    }

    /* The scrollbar 'thumb' ...that marque oval shape in a scrollbar */
    &::-webkit-scrollbar-thumb:vertical {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 100px;
    }
    &::-webkit-scrollbar-thumb:vertical:active {
        background: rgba(0, 0, 0, 0.61); /* Some darker color when you click it */
        border-radius: 100px;
    }
}
.list-group-item {
    border: none;
    padding: 0 1.25rem;
    margin: 0 0 0.5rem 0.25rem;
    &:hover {
        background: #f7f7f7;
    }
}
</style>
