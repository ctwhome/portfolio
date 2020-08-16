<template>
  <div class="container">
    <div>
      <img
        src="~/assets/ctw-grey.svg"
        v-tilt="tilt"
        alt="Ctw Creating a Technological World Logo"
        class="ctw-logo"
      />
      <div class="grid-buttons">
        <img src="~/assets/ux.svg" v-tilt="tilt" alt="UX Button" class="card" />
        <img
          src="~/assets/dev.svg"
          v-tilt="tilt"
          alt="Research engineering Button"
          class="card"
        />
      </div>

      <div class="quote">
        <span>Engineering</span> should have a purpose. <br />
        <span>Design</span> should have a meaning. <br />
        And ultimately, <span>Technology</span> should empower people.
      </div>

      <div class="links">
        <a
          href="https://www.linkedin.com/in/ctwhome/"
          target="_blank"
          class="button--grey"
        >
          LinkedIn
        </a>
        <a
          href="https://www.behance.net/ctwhome"
          target="_blank"
          class="button--grey"
        >
          Behance
        </a>
        <a
          href="https://github.com/ctwhome"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tilt: {
        reverse: true, // reverse the tilt direction
        max: 25, // max tilt rotation (degrees)
        perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
        scale: 1.2, // 2 = 200%, 1.5 = 150%, etc..
        speed: 2000, // Speed of the enter/exit transition
        transition: true, // Set a transition on enter/exit.
        axis: null, // What axis should be disabled. Can be X or Y.
        reset: true, // If the tilt effect has to be reset on exit.
        easing: 'cubic-bezier(.03,.98,.52,.99)', // Easing on enter/exit.
        glare: false, // if it should have a "glare" effect
        'max-glare': 1, // the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
        'glare-prerender': false, // false = VanillaTilt creates the glare elements for you, otherwise
        // you need to add .js-tilt-glare>.js-tilt-glare-inner by yourself
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.ctw-logo {
  width: 180px;
  margin: 16px auto;
  opacity: 0.6;
}

.grid-buttons {
  padding: 16px;
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr;
  @media only screen and (max-width: 600px) {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
  }
}

.card {
  animation: 1s appear;
  width: 100%;

  &:hover {
    background-color: #1b1d2850;
  }
}

.quote {
  color: #7f828b;
  animation: 1s appear;

  margin: 2rem auto;

  span {
    color: #ffffff95;
  }
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
  animation: 1s appear;
  /*animation-delay: 500ms;*/
}

@keyframes appear {
  0% {
    opacity: 0;
  }
}
</style>
