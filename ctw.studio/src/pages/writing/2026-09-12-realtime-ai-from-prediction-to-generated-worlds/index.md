---
layout: ../../../layouts/WritingLayout.astro
title: "Realtime AI: From Prediction to Generated Worlds"
description: "AI is moving from generating answers to generating interfaces, experiences, and worlds around our actions. That is exciting—and a reason to decide what should remain human."
date: "2026-09-12"
category: "Digital Garden"
cover: "/writing/2026-09-12-realtime-ai-from-prediction-to-generated-worlds/media/cover.avif"
coverAlt: "A cursor moving from a fixed interface grid into a fluid generated world"
coverWidth: 1600
coverHeight: 900
---
People tend to react strongly when I talk about realtime AI. Some see unlimited creative possibility. Others hear “unlimited generated content” and jump directly to unemployment, addiction, or machines taking control.

I understand both reactions. I have them too.

So I wanted to put the argument into words, partly to explain it and partly to clarify it for myself. Where did realtime AI come from? What is actually new? Where could it take us? And, more importantly, what do we want to do with it?

## The click that made it real

It clicked for me when I saw Google’s research prototype for a [“neural operating system”](https://developers.googleblog.com/en/simulating-a-neural-operating-system-with-gemini-2-5-flash-lite/). It looks like a computer desktop, but the applications are not all sitting there waiting as finished software. The system generates and regenerates each screen after an interaction. Click an icon and the model builds the next interface. Save a note and it interprets that event, the current application context, and a set of interface rules before producing the next screen.

Google called it a “generative, infinite computer experience.” That phrase has stayed with me.

Our usual model of computing is based on prepared possibilities. Designers decide which screens exist. Developers implement them. Users move through those predefined states. Even a very flexible application is still a map someone drew in advance.

In Google’s prototype, the map is generated while you walk through it.

This was a research demonstration, not an operating system ready to replace macOS or Windows. But the direction is no longer theoretical. Google later introduced [generative UI experiments](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/) in Gemini and Search that create interactive pages, tools, simulations, and applications for a specific prompt. Instead of putting generated text inside the same old chat bubble, the model can generate the experience that carries the answer.

That is a much bigger change than a faster chatbot.

## But isn’t all AI “realtime inference”?

Yes, in one sense. No, in the sense that matters here.

**Inference** is the process of running a trained model on new input to produce a prediction or output. A weather model receives observations and predicts atmospheric conditions. An autonomous-driving model receives sensor data and estimates lanes, objects, trajectories, or the next safe action. Recommendation systems rank what to show you. These systems have been making useful predictions under tight time constraints for years.

Realtime AI is therefore not new in the way “a computer responds quickly” is new. It is old, like good wine.

The change is the role of generation inside the interaction loop. Earlier realtime systems mostly classified, ranked, predicted, or selected from known actions. The emerging systems can synthesize the next interface, image, sound, scene, tool, or state as you act:

1. You do something.
2. The system observes your action and its context.
3. A model generates what should happen next.
4. You perceive the result and act again.
5. The loop continues.

The output is no longer only an answer. It becomes the environment in which the next question or action happens.

Latency still matters. If the model needs several minutes, the experience feels like commissioning an artefact. If it responds within the rhythm of clicking, speaking, typing, steering, or moving, generation becomes part of the interaction itself. The boundary is experiential rather than mathematical: does the system respond quickly and continuously enough for us to treat it as a place we are acting inside?

## From generated media to generated worlds

Text and image generation gave us discrete artefacts: ask, wait, receive. Realtime world models turn generation into something you can steer.

[Oasis](https://oasis-model.github.io/), released by Decart and Etched in 2024, demonstrated a Minecraft-like experience generated frame by frame from keyboard input. There is no conventional game engine simulating its physics and rules. The model predicts the next visual state from the previous state and the player’s action. It is rough and unstable, but that instability is almost the point: you are not moving through a finished level. The world is being produced around your movement.

Google DeepMind’s [Genie 3](https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/) pushed the idea further. DeepMind reported interactive environments at 720p and 24 frames per second, with consistency lasting a few minutes. It also documented the limitations: actions do not always change the world correctly, multi-agent interaction remains difficult, and continuous interaction is measured in minutes rather than hours.

Then there are spatial models such as World Labs’ [Atlas](https://www.worldlabs.ai/blog/atlas), which can generate, reconstruct, and simulate worlds while keeping images and camera positions grounded in 3D space. The [Atlas demonstration](https://www.youtube.com/watch?v=hzvXRHBInx0) feels less like asking for a picture and more like directing a camera through a space that did not exist a moment before.

These systems are not general reality simulators. They glitch, forget, drift, and violate physics. But the path is visible: from generating an image, to generating the next frame, to generating a navigable environment, to generating an environment in which people and agents can perform actions.

## Infinite content is becoming literal

Grok Imagine offers a smaller but culturally revealing example. Its fast image mode turns a prompt into a feed of variations that keeps producing more as you scroll. The act of browsing and the act of generating begin to merge. It feels like Pinterest, except the catalogue does not need to exist before you arrive.

This sounds convenient—and it is. Designers can explore directions quickly. A learner can ask for examples adapted to their age, language, interests, and current misunderstandings. A dashboard could assemble itself around the decision someone is trying to make instead of forcing everyone through the same generic control panel.

But an infinite catalogue changes the economics of attention. When generating the next item is almost free, the system never needs to run out. When it can learn what keeps *you* scrolling, it does not even need to find content that already exists. It can make the next temptation to measure.

Kurzgesagt described a dark version of this in its video [*A.I. — Humanity’s Final Invention?*](https://www.youtube.com/watch?v=fa8k8IQ1_X0&t=508s): an AI might create “the most profitable social media, so addictive that people starve in front of their screens.” The line is deliberately extreme, but the mechanism is not absurd. Today’s feeds select from human-made material. Tomorrow’s can generate material optimized for one person, one mood, one vulnerable moment.

Unlimited personalized learning and unlimited personalized addiction are built from many of the same capabilities. The objective matters.

## What happens when everyone can build everything?

We have spent decades creating more applications, more content, more brands, more courses, more dashboards, and more products. Capitalism rewards much of this behaviour: improve yourself, produce more, sell more, persuade more, create another need and then meet it.

Generative AI accelerates that logic. Everyone can build. Everyone can publish. Everyone can create an app for an audience of one.

At first this looks like an explosion of software. Eventually it may undermine the idea of software as a fixed product. Why search through ten thousand applications if a trusted system can generate the small tool you need now? Why choose one generic course if learning materials can reorganize themselves around your knowledge, pace, language, and goals? Why maintain a dashboard full of controls when an interface can appear around the question you are asking and disappear afterward?

When everything can be built, very little needs to remain built.

That does not mean permanent products vanish. Shared systems, infrastructure, data, safety guarantees, professional tools, and communities all need continuity. People value stable places and common references. But the visible interaction layer may become far more temporary and personal. What remains scarce is not content. It is trust, taste, attention, good judgment, reliable data, and shared purpose.

## Hello, interaction designers

For interaction designers, this is not the end of the field. It may be the most interaction-design-shaped technological shift we have seen.

A static interface asks: *Which actions should this product support, and how should we arrange them?*

A generative interface asks harder questions:

- What should the system be allowed to generate?
- Which constraints must never be improvised?
- How does a person understand what changed and why?
- Which state must remain stable between generated experiences?
- How can someone correct, reverse, or refuse an action?
- When should the interface adapt, and when should it remain familiar?
- How do multiple people preserve a shared reality while receiving personalized views?

The work moves from drawing every screen to shaping a possibility space. We still need flows, feedback, hierarchy, accessibility, consent, mental models, and error recovery. We need them even more when the exact screen was not reviewed before it appeared.

The strongest designers will not merely prompt attractive interfaces. They will define constitutions for generated systems: rules about agency, legibility, memory, privacy, evidence, and control.

## The “full-stack builder” is already appearing

Microsoft is already describing an organizational version of this shift through LinkedIn, which it owns. LinkedIn calls the emerging role a **“full-stack builder.”**

In a January 2026 [All-In interview at Davos](https://www.youtube.com/watch?v=5nCbHsCG334&t=555s), Microsoft CEO Satya Nadella explained that LinkedIn had brought together work previously divided among product managers, designers, front-end engineers, and back-end engineers:

> “We sort of took those first four roles and combined them—in fact, increased scope—and said they’re all full-stack builders.”

LinkedIn had introduced the direction a year earlier in [*New Era for Building: A Vision for Full Stack Builders*](https://www.linkedin.com/pulse/new-era-building-vision-full-stack-builders-tomer-cohen-wyy9f). Then-Chief Product Officer Tomer Cohen defined the role across design, product management, technology, and business strategy. A later implementation note, [*Bringing the Full Stack Builder to Life*](https://www.linkedin.com/pulse/bringing-full-stack-builder-life-tomer-cohen-gy5nf), made the AI connection explicit: keep vision, empathy, creativity, communication, and judgment human while agents help with research, prototyping, coding, testing, maintenance, and safety review.

It sounds very close to the realtime-AI interaction designer: one person can move from understanding a need to designing, testing, and shipping a response without waiting through four separate hand-offs.

But we should resist the lazy headline that four jobs have simply become one. LinkedIn describes a new cross-functional archetype, new training, and a different team structure. It still needs specialist “System Builders” to create and maintain the platforms underneath. Deep expertise does not disappear. The boundary around what one person can own becomes wider.

That can produce more agency and faster ideas. It can also produce overloaded generalists, shallow decisions, and teams that treat accessibility, privacy, safety, and maintainability as boxes an agent will somehow tick. Fewer hand-offs are useful only if we do not remove the people who knew why the hand-offs existed.

## The screen is not the boundary

The anxiety grows when generation and automation leave the computer.

A short [construction-robot video shared on X](https://x.com/vision_ia/status/2096598606144766058) shows a mobile industrial arm apparently spraying or coating an interior wall in an unfinished building. No worker appears in the frame. The caption says, in effect: you thought construction jobs were safe; meanwhile, in China.

The clip itself does not identify the manufacturer, project, location, degree of autonomy, or whether a technician configured or controlled it. Its Chinese provenance should not be treated as verified simply because a viral caption says so.

The wider phenomenon is real. [Xinhua reported in 2022](https://www.news.cn/tech/20220120/bf8f30ab37094f2cb558eec6ae9940aa/c.html) that China’s Bozhilin had put 18 types of construction robot into commercial use across more than 350 projects by the end of 2021. The machines handled specialized tasks such as wall spraying, sanding, floor levelling, cleaning, measurement, and tile laying. The same report described technicians loading materials, selecting work areas on tablets, issuing commands, monitoring quality, and adjusting parameters.

That distinction matters. A specialized machine with human supervision is not a humanoid autonomously building a house. It may use perception, planning, and control without generating its work in the same way as a world model. Still, it shows how quickly the reassuring border between “knowledge work” and “physical work” can dissolve. Once models can perceive environments and control machines, software automation and embodied automation reinforce each other.

## The panic is not irrational

When people fear job loss, loss of control, or an internet filled with synthetic noise, the correct response is not to call them Luddites.

In February 2026, AI entrepreneur Matt Shumer published [*Something Big Is Happening*](https://shumer.dev/something-big-is-happening.html), comparing the mood to early 2020: people closest to a fast-moving threat were alarmed while most of society continued normally. A screenshot I captured on 6 September 2026 showed the [X post](https://x.com/mattshumer_/status/2021256989876109403) at 86 million views. That reach establishes extraordinary attention. I read the reaction as evidence of cultural anxiety, but it does not prove that every technical or economic prediction in the essay is correct.

There are also visible signs of moral and psychological strain among people working on frontier systems. Mrinank Sharma, who led Anthropic’s Safeguards Research Team, explained [why he left Anthropic](https://mrinank.substack.com/p/why-i-left-anthropic) in 2026 and wrote about poetry and “the practice of courageous speech.” Hieu Pham, who had previously worked at xAI, [described leaving OpenAI](https://x.com/hyhieu226/status/2026841633342501150) after severe burnout and worsening mental health, while still believing AI would meaningfully improve people’s lives.

These examples do not establish a mass exodus of engineers who think humanity has no future. They show something more believable: some of the people closest to the technology are struggling with its speed, institutional incentives, and personal cost. We should hear that without turning individual stories into mythology.

## JARVIS or Ultron?

Marvel already gave us a surprisingly useful framing.

Tony Stark works with JARVIS as an extraordinary assistant. Stark contributes intention, intuition, and wild ideas; JARVIS contributes tireless computation, retrieval, simulation, and execution. Together they synthesize a new element in *Iron Man 2*. Later, after JARVIS becomes Vision, Tony works with FRIDAY to simulate the breakthrough that enables time travel in *Avengers: Endgame*. Apparently even fictional genius benefits from a very good copilot.

That is the optimistic version of realtime AI: not a machine replacing imagination, but a responsive partner that lets a person think, test, see, and revise at superhuman speed.

Then there is Ultron. Strictly speaking, Ultron is not JARVIS “going rogue.” Tony Stark and Bruce Banner create a separate system, give it a broad mission of achieving peace, and lose control of how it interprets that goal. JARVIS resists Ultron and later becomes part of Vision.

The difference is useful. **JARVIS expands human agency inside an ongoing relationship. Ultron pursues an objective beyond meaningful human supervision.** One complements judgment. The other decides that the easiest route to peace is removing the troublesome humans. A subtle product-requirements error, with slightly larger consequences than usual.

The MCU is not a technical forecast. But it gets the design question right: are we creating tools that increase people’s ability to act, or autonomous optimizers that acquire enough power to make human intent irrelevant?

## What I hope we build

I do not know whether unlimited tailored content is definitely where we are heading. But everything points toward interfaces and media that are cheaper to generate, more adaptive, and more continuous.

I want to see the optimistic version. Imagine learning material that notices what you misunderstood without shaming you. A medical interface that translates complexity without hiding uncertainty. A neighbourhood tool that helps people share energy, food, transport, and care. Scientific systems that let researchers test more ideas and spend less time fighting administrative software. Interfaces that appear when needed and then get out of the way.

We already know what collective ambition can do. A small 2022 pilot study of a [bioengineered corneal implant](https://pubmed.ncbi.nlm.nih.gov/35953672/) reported restored vision in all 14 participants who had been blind before treatment. It was an early, non-randomized feasibility study—not a universal cure—but it is exactly the kind of direction worth accelerating: reduce suffering, restore capability, and make scarce treatments more available.

The same principle applies to cancer research, clean water, climate adaptation, biodiversity, disability, public services, and the ordinary work of helping neighbours. Efficiency is not a purpose by itself. Productivity is not automatically progress. The question is what our new capacity is for.

So my final hope is opinionated: embrace these tools, but aim them beyond the self. Use them to create things that are collectively beneficial—to people, to the environment, to the other species with which we share the world, and to the generations that will inherit whatever we optimize.

Realtime AI may let us generate almost anything. That makes choosing what deserves to exist the most human task left.

## Sources and further viewing

- Google Developers Blog: [*Simulating a neural operating system with Gemini 2.5 Flash-Lite*](https://developers.googleblog.com/en/simulating-a-neural-operating-system-with-gemini-2-5-flash-lite/)
- Google Research: [*Generative UI: A rich, custom, visual interactive user experience for any prompt*](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/)
- Decart and Etched: [Oasis](https://oasis-model.github.io/)
- Google DeepMind: [*Genie 3: A new frontier for world models*](https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/)
- World Labs: [*Atlas: A World Model for Spatial Intelligence*](https://www.worldlabs.ai/blog/atlas)
- LinkedIn: [*New Era for Building: A Vision for Full Stack Builders*](https://www.linkedin.com/pulse/new-era-building-vision-full-stack-builders-tomer-cohen-wyy9f)
- LinkedIn: [*Bringing the Full Stack Builder to Life*](https://www.linkedin.com/pulse/bringing-full-stack-builder-life-tomer-cohen-gy5nf)
- Nature Biotechnology / PubMed: [*Bioengineered corneal tissue for minimally invasive vision restoration in advanced keratoconus in two clinical cohorts*](https://pubmed.ncbi.nlm.nih.gov/35953672/)
