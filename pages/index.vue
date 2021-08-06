<template>
  <div>
    <div class="first-fold py-16">
      <div class="container m-auto px-6">
        <div class="lg:flex justify-between items-center">
          <div class="lg:w-6/12 lg:p-0 p-7 slidein-animation">
            <h1 class="text-5xl font-bold font-title ">
              J. Gonzalez
            </h1>

            <p class="mt-10 text-4xl font-serif">
              Creates experiences weaving together strong <span class="ctw-text-gradient">design aesthetics</span> with
              <span class="ctw-text-gradient-green"> technical engineering</span> know-how.
            </p>
            <p class="mt-10 text-xl opacity-80">
              Product Designer & Research Software Engineer <br class="hidden sm:inline"> at
              <a class="text-blue-300 glow" href="https://esciencecenter.nl" target="_blank" rel="noopener">The Netherlands eScience Center</a>
            </p>
          </div>

          <div class="lg:w-5/12 order-2">
            <img
              v-tilt="tilt"
              src="~/assets/ctw-jos-profile.jpg"
              style="
                  width: 100%;
                  object-fit: cover;
                  height: 450px;
                  transform: scale(1) perspective(1040px) rotateY(-11deg)
                    rotateX(2deg) rotate(2deg);
                "
              alt="Jos Ctw Profile"
              class="rounded"
            >
          </div>
        </div>
      </div>
    </div>

    <div class="container flex flex-col-reverse md:flex-row gap-10 mt-20 mx-auto">
      <!--        digital garden-->
      <div class=" md:w-1/3 ">
        <nuxt-link to="/digital-garden">
          <img
            v-tilt="tilt"
            class="w-full -mt-10"
            tag="nuxt-link"
            src="~/assets/digital-garden.svg"
            alt="UX Button"
          >
        </nuxt-link>
        <p class="mt-8">
          A consistently tended collection of half-baked notes, research, and sketches.
        </p>

        <div class="flex flex-col mt-10 gap-6 ">
          <nuxt-link v-for="index in 6 " :key="index" to="/">
            <div
              class="bg-base-100 rounded p-2 flex gap-2 h-28
                border-opacity-0 hover:border-opacity-100 border-b-4 border-primary shadow
                hover:bg-base-200 hover:bg-opacity-30
                transition ease-in-out duration-300 hover:shadow-xl transform hover:scale-105"
            >
              <div class="text-xl font-medium w-3/4">
                Three lines title and trim if is possible? or maybe something smaller
              </div>
              <div class="1-4 text-sm text-base-content text-opacity-70">
                <div>23, jul 2021</div>
                <div>Evergreen 🌳</div>
              </div>
            </div>
          </nuxt-link>

          <nuxt-link to="/digital-garden" class="btn btn-ghost ml-auto normal-case">
            Visit the Garden
          </nuxt-link>
        </div>
      </div>

      <!--        second-->
      <div class="flex flex-col sm:flex-row md:w-2/3 gap-6">
        <!--          design-->
        <div class="">
          <nuxt-link to="/product-design">
            <img
              v-tilt="tilt"
              tag="nuxt-link"
              class="w-full"
              src="~/assets/product-design.svg"
              alt="UX Button"
            >
          </nuxt-link>

          <div class="flex flex-col mt-20 gap-8">
            <nuxt-link
              v-for="index in 3 "
              :key="index"
              to="/"
              class="bg-base-100 rounded flex flex-col gap-2
                border-opacity-0 hover:border-opacity-100 border-b-4 border-primary shadow
                hover:bg-base-200 hover:bg-opacity-30
                transition ease-in-out  hover:shadow-xl transform duration-300 hover:scale-105"
            >
              <img :src="`https://picsum.photos/id/${index+10}/300`" class="h-40 object-cover rounded-t" alt="">
              <div class="text-2xl font-medium px-2">
                Three lines title and trim if is possible? or maybe something smaller
              </div>
              <div class="1-4 text-sm text-base-content text-opacity-70 px-2 pb-4">
                <div>23, jul 2021</div>
              </div>
            </nuxt-link>

            <nuxt-link to="/digital-garden" class="btn btn-ghost ml-auto normal-case">
              See more Design Projects
            </nuxt-link>
          </div>
        </div>
        <!--          web-->
        <div class="">
          <nuxt-link class="" to="/web">
            <img
              v-tilt="tilt"
              class="w-full"
              tag="nuxt-link"
              src="~/assets/web.svg"
              alt="UX Button"
            >
          </nuxt-link>

          <div class="flex flex-col mt-20 gap-8">
            <nuxt-link
              v-for="index in 3 "
              :key="index"
              to="/"
              class="bg-base-100 rounded flex flex-col gap-2
                border-opacity-0 hover:border-opacity-100 border-b-4 border-primary shadow
                hover:bg-base-200 hover:bg-opacity-30
                transition ease-in-out  hover:shadow-xl transform duration-300 hover:scale-105"
            >
              <img :src="`https://picsum.photos/id/${index+32}/300`" class="h-40 object-cover rounded-t" alt="">
              <div class="text-2xl font-medium px-2">
                Three lines title and trim if is possible? or maybe something smaller
              </div>
              <div class="1-4 text-sm text-base-content text-opacity-70 px-2 pb-4">
                <div>23, jul 2021</div>
              </div>
            </nuxt-link>

            <nuxt-link to="/digital-garden" class="btn btn-ghost ml-auto normal-case">
              Read more Web Engineering
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <footer-main class="mt-40" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      tilt: {
        reverse: true, // reverse the tilt direction
        max: 25, // max tilt rotation (degrees)
        perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
        scale: 1, // 2 = 200%, 1.5 = 150%, etc..
        speed: 2000, // Speed of the enter/exit transition
        transition: true, // Set a transition on enter/exit.
        axis: null, // What axis should be disabled. Can be X or Y.
        reset: true, // If the tilt effect has to be reset on exit.
        easing: 'cubic-bezier(.03,.98,.52,.99)', // Easing on enter/exit.
        glare: false, // if it should have a "glare" effect
        'max-glare': 1, // the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
        'glare-prerender': false // false = VanillaTilt creates the glare elements for you, otherwise
        // you need to add .js-tilt-glare>.js-tilt-glare-inner by yourself
      }
    }
  }
}
</script>

<style scoped>
a.glow {
  transition: text-shadow 200ms ease;
}

a.glow:hover {
  text-shadow: 0px 0px 4px white;
}

.ctw-text-gradient {
  background: -webkit-linear-gradient(
    110deg,
      /*#456563 24.71%,*/
      /*#5A877E 37.34%,*/
    #FDC343 51.57%,
    #E99877 67.46%
    /*#A4574E 85.7%*/
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.ctw-text-gradient-green {
  background: -webkit-linear-gradient(
    110deg,
      /*#456563 24.71%,*/
    #5A877E 37.34%,
      /*#FDC343 51.57%,*/
    #E99877 67.46%
    /*#A4574E 85.7%*/
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
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
}

.card {
  animation: 1s appear;
  width: 100%;
}

.card:hover {
  background-color: #1B1D2850;
}

.quote span {
  color: #FFFFFF95;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
  'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495E;
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
