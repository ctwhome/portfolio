<template>
  <div>
    <div class="first-fold">
      <div>
        <img
          v-tilt="tilt"
          src="~/assets/ctw-grey.svg"
          alt="Ctw Creating a Technological World Logo"
          class="ctw-logo"
        />
        <div class="grid-buttons">
          <img
            v-tilt="tilt"
            style="
              transform: scale(1) perspective(1040px) rotateY(11deg)
                rotateX(2deg) rotate(2deg);
            "
            src="~/assets/ux.svg"
            alt="UX Button"
            class="card"
          />
          <img
            v-tilt="tilt"
            style="
              transform: scale(1) perspective(1040px) rotateY(-11deg)
                rotateX(2deg) rotate(2deg);
            "
            src="~/assets/dev.svg"
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
    <div class="second-fold">
      <div class="py-16">
        <div class="container m-auto px-6">
          <div class="lg:flex justify-between items-center">
            <div class="lg:w-6/12 lg:p-0 p-7">
              <h1 class="text-4xl font-bold leading-tight mb-5 text-gray-300">
                Hi! I am J.
                <span class="ctw-text-gradient">UX Engineer.</span>
              </h1>
              <p class="text-xl text-gray-100">
                I weave together strong design aesthetics with technical
                engineering know-how. Don't know what that means? take a look at
                my portfolio on
                <a
                  class="glow underline hover:text-grey"
                  href="https://www.behance.net/ctwhome"
                  target="_blank"
                  >Behance</a
                >!
              </p>

              <div class="py-5">
                <a
                  href="mailto:ctw@ctwhome.com?subject=Hire UX or Engineering services&body=Hi Jos!,%0D%0A%0D%0AWe are excited about your services.%0D%0AWe are thinking to improve our <brand image / website / application / users happiness>%0D%0A%0D%0AThese are the project details...%0D%0A%0D%0ABest,"
                  class="text-black rounded-full py-2 px-5 text-lg font-semibold border text-white inline-block hover:bg-white hover:text-black inline-flex items-center transition duration-200 ease-in-out"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23 0C22.904 0.000658358 22.8086 0.0151297 22.7168 0.0429688C22.6898 0.0503069 22.663 0.0587779 22.6367 0.0683594L0.650391 7.06055V7.06445C0.459629 7.13564 0.295142 7.26336 0.178919 7.43054C0.0626958 7.59772 0.000274647 7.79639 0 8C0.000364268 8.17172 0.0449404 8.34045 0.129435 8.48994C0.213929 8.63943 0.335495 8.76464 0.482422 8.85352L7.16406 14.1543L20.373 3.62695L9.8457 16.8359L15.1426 23.5137C15.2313 23.6619 15.3569 23.7846 15.5072 23.8698C15.6575 23.9551 15.8272 23.9999 16 24C16.2036 23.9997 16.4023 23.9373 16.5695 23.8211C16.7366 23.7049 16.8644 23.5404 16.9355 23.3496H16.9395L23.9375 1.34375C23.9447 1.32378 23.9512 1.30359 23.957 1.2832C23.9849 1.19135 23.9993 1.09597 24 1C24 0.734784 23.8946 0.48043 23.7071 0.292893C23.5196 0.105357 23.2652 0 23 0V0Z"
                      fill="currentColor"
                    />
                  </svg>
                  Hire me</a
                >
              </div>
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="m-8">
      <TheHeader />
      <NuxtLink to="/">
        <h1 class="font-bold text-4xl">Blog Posts</h1>
      </NuxtLink>
      <ul class="flex flex-wrap">
        <li
          v-for="article of articles"
          :key="article.slug"
          class="xs:w-full md:w-1/2 px-2 xs:mb-6 md:mb-12 article-card"
        >
          <NuxtLink
            :to="{ name: 'blog-slug', params: { slug: article.slug } }"
            class="flex transition-shadow duration-150 ease-in-out shadow-sm hover:shadow-md xxlmax:flex-col"
          >
            <img
              v-if="article.img"
              class="h-48 xxlmin:w-1/2 xxlmax:w-full object-cover"
              :src="article.img"
            />

            <div
              class="p-6 flex flex-col justify-between xxlmin:w-1/2 xxlmax:w-full"
            >
              <h2 class="font-bold">{{ article.title }}</h2>
              <p>by {{ article.author.name }}</p>
              <p class="font-bold text-gray-600 text-sm">
                {{ article.description }}
              </p>
            </div>
          </NuxtLink>
        </li>
      </ul>
      <h3 class="mb-4 font-bold text-2xl uppercase text-center">Topics</h3>
      <ul class="flex flex-wrap mb-4 text-center">
        <li
          v-for="tag of tags"
          :key="tag.slug"
          class="xs:w-full md:w-1/3 lg:flex-1 px-2 text-center"
        >
          <NuxtLink :to="`/blog/tag/${tag.slug}`" class="">
            <p
              class="font-bold text-gray-600 uppercase tracking-wider font-medium text-ss"
            >
              {{ tag.name }}
            </p>
          </NuxtLink>
        </li>
      </ul>
      <footer class="flex justify-center border-gray-500 border-t-2">
        <p class="mt-4">
          Created by
          <a
            href="https://twitter.com/debs_obrien"
            class="font-bold hover:underline"
          >
            Debbie O'Brien
          </a>
          at NuxtJS. See the
          <a
            href="https://nuxtjs.org/blog/creating-blog-with-nuxt-content"
            class="font-bold hover:underline"
          >
            tutorial
          </a>
          for how to build it.
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const articles = await $content('articles', params.slug)
      .only(['title', 'description', 'img', 'slug', 'author'])
      .sortBy('createdAt', 'desc')
      .fetch()
    const tags = await $content('tags', params.slug)
      .only(['name', 'description', 'img', 'slug'])
      .sortBy('createdAt', 'asc')
      .fetch()
    return {
      articles,
      tags,
    }
  },
  data() {
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
        'glare-prerender': false, // false = VanillaTilt creates the glare elements for you, otherwise
        // you need to add .js-tilt-glare>.js-tilt-glare-inner by yourself
      },
    }
  },
}
</script>

<style lang="scss" scoped>
a.glow {
  transition: text-shadow 200ms ease;
  &:hover {
    text-shadow: 0px 0px 4px white;
  }
}
.ctw-text-gradient {
  background: -webkit-linear-gradient(
    110deg,
    #456563 24.71%,
    #5a877e 37.34%,
    #fdc343 51.57%,
    #e99877 67.46%,
    #a4574e 85.7%
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

.first-fold {
  margin: 0 auto;
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.second-fold {
  min-height: 70vh;
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

.article-card {
  border-radius: 8px;
}
.article-card a {
  background-color: #fff;
  border-radius: 8px;
}
.article-card img div {
  border-radius: 8px 0 0 8px;
}
</style>
