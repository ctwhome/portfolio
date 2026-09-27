---
layout: ../../../layouts/WritingLayout.astro
title: "Realtime AI: From Prediction to Generated Worlds"
description: "AI is starting to generate the interface, the world, the person on camera, and the decision—not just the answer. A hopeful look at what that makes possible, why a $40 million model was matched in the open within days, and what cheap intelligence will strain in an economy built on scarcity."
date: "2026-09-12"
category: "Digital Garden"
cover: "/writing/2026-09-12-realtime-ai-from-prediction-to-generated-worlds/media/cover.avif"
coverAlt: "A cursor moving from a fixed interface grid into a fluid generated world"
coverWidth: 1600
coverHeight: 900
---
It clicked for me when I watched a computer generate its next screen instead of opening an application.

Google’s [neural operating system prototype](https://developers.googleblog.com/en/simulating-a-neural-operating-system-with-gemini-2-5-flash-lite/) looks like a desktop. Click an icon, and a language model generates the interface. Interact again, and it generates another screen, using your action, context, and a set of rules. It is a research demonstration, not a replacement for macOS or Windows. But it changes the question from *“What can this application do?”* to *“What interface would help me now?”*

That possibility excites me more than almost anything I have seen in software. It also makes me uneasy—and not only because a system that can generate what we need could just as easily generate whatever keeps us occupied. Generation is getting fast and cheap enough to change who can build things, who gets paid for them, and what anything is worth.

This essay is about both halves of that sentence: the extraordinary things we can now make, and the parts of our economy that were never designed for them.

## What actually changes

Software already adapts to us. Search results change, dashboards update, and games respond to our movement. The distinction is not that yesterday’s software was static. It is **how much of the next experience is designed in advance, and how much is generated during use**.

[Inference](https://cloud.google.com/discover/what-is-ai-inference) means running a trained model on new input to produce an output. It includes both predictions and generated content; it does not necessarily happen in realtime. Here, I use *realtime AI* for generation that responds quickly enough to become part of an ongoing interaction.

The loop is simple: **you act → the system generates → you respond**. Instead of being the end of a request, the output becomes the starting point for your next action.

<figure>
  <img class="writing-sketch" src="/writing/2026-09-12-realtime-ai-from-prediction-to-generated-worlds/media/interaction-loop.avif" alt="Graphite drawing of a person sketching at a desk, with interface panels and a landscape spiralling above the page." width="474" height="808" loading="lazy" decoding="async" />
  <figcaption>You act. The system generates. You respond. The result becomes part of the next interaction, rather than a finished artefact.</figcaption>
</figure>

Speed matters, but so does continuity. A screen that appears quickly is not useful if it forgets what you just did. Google’s desktop prototype explored caching previously generated screens so revisiting one did not mean reinventing it.

Nor is every generative interface realtime. In its November 2025 [generative UI report](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/), Google showed custom tools and simulations, but noted that generation could take a minute or more. That is evidence for generating an experience, not proof that every experience is already instantaneous.

## From a picture to a world you can steer

A generated picture gives you one view. An interactive world lets you turn around and ask, through movement, what is behind you.

[Oasis](https://oasis-model.github.io/), introduced by Decart and Etched in 2024, demonstrated a Minecraft-like environment generated frame by frame from player input. Rather than using a conventional game engine to determine what happens, the model predicts the next visual state. Its authors also describe the cost: errors accumulate, and the world can lose consistency.

In its August 2025 [Genie 3 announcement](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/), Google DeepMind reported interactive environments at 720p and 24 frames per second, with consistency lasting a few minutes. It also described unreliable actions and limits on continuous interaction. Those qualifications matter as much as the impressive footage.

World Labs’ [Atlas](https://www.worldlabs.ai/blog/atlas) explores a related problem: grounding generated views in 3D space. These are different approaches, not interchangeable products or a single ladder of progress. Together, they make a new kind of interaction easier to imagine: you do not just request a scene; you help determine what happens next.

Pause on how strange and wonderful that is. A child could walk through a reconstruction of the city their grandparents grew up in. A student could step inside a cell, or a volcano, or a Roman market, and ask questions with their feet. A designer could stand in a room before a single wall exists.

But a convincing world is not necessarily a reliable simulation. A generated bridge might look plausible while teaching you nothing trustworthy about whether a real bridge would stand. Visual coherence and physical validity are different requirements.

## Anyone, live

Worlds are not the only thing that can now be generated while you watch. So can people.

I keep seeing the same kind of clip: someone sits at a desk in front of an ordinary webcam, and the person who appears on screen is someone else entirely. A different face, a different body, a cartoon character, an elderly man, a woman in a spacesuit. They blink, laugh, turn their head, and the character does too—live, with no editing afterwards. Switch the reference image and they become someone else mid-sentence.

This is not a special-effects studio. Decart’s [Lucy 2.1](https://decart.mintlify.app/models/realtime/overview) takes a live camera stream and a single reference image, then maps your expressions, head movements, and gestures onto that character in realtime. [MorphMe Live](https://morphmelive.com/), built on Decart’s models, sells full-body character swaps to streamers and pipes the result straight into OBS, Twitch, YouTube, or Zoom. The open-source [Deep-Live-Cam](https://github.com/XORandom/Deep-Live-Cam) reduces a live face swap to three steps: select a face, select a camera, press live.

At a glance, the result is increasingly hard to tell apart from a real person. And the creative side is wonderful. A shy person can perform without being seen. Someone who does not want their face online can still host a show—MorphMe explicitly markets to “privacy-first streamers.” A theatre group can cast a dragon. A teacher can become Marie Curie for an afternoon. One performer can voice and embody a whole cast.

Now apply that to the influencer economy. A single person behind a single camera can run a roster of personas—different ages, genders, ethnicities, styles—each with its own audience, sponsorships, and backstory. The person you follow, trust, and buy from may be one of five characters played by someone you will never see. Some will say so openly; MorphMe includes disclosure templates, and says Decart and most platforms ask streamers to note AI use. Many will not.

The harder cases are not entertainment. In 2024, an employee at the engineering firm Arup in Hong Kong joined a video call with what appeared to be the company’s chief financial officer and several colleagues, then made 15 transfers totalling HK$200 million—about US$25 million—before discovering that the others on the call had been generated. [Arup confirmed](https://www.ft.com/content/b977e8d4-664c-4ae4-8a8e-eb93bdf785ea) that fake voices and images were used. That happened before live character swaps were a consumer product you could open in a browser.

For most of the history of video, a face on camera was reasonable evidence that a particular person was there. That assumption is ending. Trust will have to move somewhere else: to verified accounts, cryptographic [content credentials](https://c2pa.org/), shared secrets, callbacks on a known number, and people we know in person.

## A tool for one moment

The more immediate possibility may be less spectacular than a generated world: a small interface that exists only because you need it.

Imagine arranging a meeting with three colleagues. Rather than moving between calendars and messages, you ask: *“Find a time next week when everyone is free.”* A compact comparison appears. You exclude mornings. It updates. You choose a slot and approve the invitation.

This is a design scenario, not a claim that a particular product handles the whole task reliably today. Its appeal is simple: the interface follows the decision instead of making you learn an application first.

But notice what must **not** be generated: people’s actual availability, their permissions, or whether an invitation was sent. Those facts must come from connected systems and confirmed results. The layout may be temporary; the records cannot be imaginary.

<figure>
  <img class="writing-sketch" src="/writing/2026-09-12-realtime-ai-from-prediction-to-generated-worlds/media/stable-foundations.avif" alt="Graphite drawing of a glass workspace resting on stone layers marked for persistent data, permissions, and meaningful actions." width="482" height="808" loading="lazy" decoding="async" />
  <figcaption>Let the interface adapt. Keep the foundations dependable: real records, enforced permissions, and actions whose results can be checked.</figcaption>
</figure>

This is why I do not expect permanent software simply to disappear. Shared documents, specialist tools, infrastructure, and familiar places still need continuity. Generating a different menu every morning would often be worse, not better.

The useful distinction is between **what can adapt** and **what people need to rely on**. Perhaps we will need fewer fixed screens around some tasks. That does not mean we need less engineering underneath them.

## Intelligence as a function call

Screens and worlds are the visible side of this shift. The quieter side may matter more: models that do not talk at all, but decide.

*Added 27 September 2026.* In mid-September 2026, TypeSafe AI [introduced Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), which it calls a *System One model*. Jev does not write prose. You give it messy input—an email, a support ticket, a game state—plus a set of typed questions, and it returns structured answers with confidence scores: which queue, how urgent, how likely to churn. TypeSafe reports end-to-end responses of roughly 70 to 500 milliseconds and input pricing of $0.042 per million tokens, and describes Jev as “a frontier-intelligence function call.” Because every possible answer is defined in advance, the output cannot be malformed; the model can still be wrong, but it cannot invent a category that does not exist.

That matters for realtime systems. A chat model that takes seconds to answer can sit beside a person. A decision that takes a tenth of a second can sit *inside* the software, on every click, every message, every frame. TypeSafe’s own demonstrations include a bot playing Doom from structured game state at around ten decisions per second.

At launch, the company [announced](https://www.businesswire.com/news/home/20260915525333/en/TypeSafe-AI-Emerges-From-Stealth-With-%2440M-in-Funding-With-New-Model-for-Composable-AI) that it had emerged from stealth with **$40 million in seed funding** led by DCVC. The founder later told the Financial Times that the round had closed more than a year earlier at a $200 million valuation—and, [according to the same report](https://financialpost.com/financial-times/cheap-new-ai-model-taking-aim-openai-anthropic), investors were already floating offers that would value the company at $10 billion or more.

The name is a deliberate nod to the [Jevons paradox](https://en.wikipedia.org/wiki/Jevons_paradox): the nineteenth-century observation that making coal use more efficient led Britain to burn *more* coal, not less. Keep that name in mind. It is the most honest thing in the launch.

## Three days later

On 18 September 2026—three days after Jev’s public launch on 15 September—Convai Innovations released [**Laya**](https://flowtivity.ai/blog/laya-open-source-jev-alternative/): an open-weights decision model family built around the same idea. Same shape of input, same typed choices, scores and yes/no answers with probabilities, all evaluated in a single pass. Apache 2.0 licence. `pip install laya`. It runs on hardware you control.

Its English checkpoint has about 421 million parameters, built on the open ModernBERT encoder—small enough to sit on one modest GPU. In the project’s own measurements it answers a single question in **32.8 milliseconds** on an NVIDIA T4, several times faster than the 236–276 ms reported for Jev in third-party tests. There is no per-token bill, because there is no meter.

The honest version of this story is more interesting than the viral one, so here it is:

<table class="writing-data-table">
  <caption>Jev and Laya at launch, as reported by their makers and one independent review. Figures come from different runs and are not a controlled comparison.</caption>
  <thead>
    <tr><td></td><th scope="col">Jev (TypeSafe)</th><th scope="col">Laya (Convai)</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Access</th><td data-label="Jev">Closed model, waitlisted API</td><td data-label="Laya">Open weights, Apache 2.0, self-hosted</td></tr>
    <tr><th scope="row">Funding</th><td data-label="Jev">$40M seed round</td><td data-label="Laya">Independent release</td></tr>
    <tr><th scope="row">Latency, one question</th><td data-label="Jev">236–276 ms (third-party)</td><td data-label="Laya">32.8 ms on a T4 GPU (self-reported)</td></tr>
    <tr><th scope="row">Price per million input tokens</th><td data-label="Jev">$0.042</td><td data-label="Laya">$0, plus your own hardware and energy</td></tr>
    <tr><th scope="row">Typed-decision accuracy</th><td data-label="Jev">0.727 published; zero-shot conditions not stated</td><td data-label="Laya">0.362 accuracy zero-shot on a typed-decision benchmark; 0.766 after fine-tuning on that benchmark’s training split</td></tr>
    <tr><th scope="row">Many options (77 labels)</th><td data-label="Jev">0.870 accuracy</td><td data-label="Laya">0.425 accuracy</td></tr>
  </tbody>
</table>

So no, Laya is not a perfect copy. It is a fast base you still have to specialise with your own labelled examples. Without a GPU, a reviewer found it slow enough to be a batch tool rather than something that sits in a live request. And the “three days” separates publication dates, not development timelines: Laya’s author says he published the underlying approach in 2025 papers, long before either launch.

But none of that changes the part that should make every investor sit up. Within a week of a $40 million announcement—while billion-dollar valuations were still being discussed—a small, downloadable, faster-on-the-right-hardware version of the core idea was available to anyone. As Flowtivity’s review put it: **a model is not a moat**.

## What cheap intelligence does to capital

Here is where optimism has to be joined by clear eyes. The technology is not the problem. The problem is that our economic system mostly rewards **scarcity**, and this technology manufactures abundance.

What follows is my reading of the incentives, not a forecast. But I think each tension is already visible.

**Valuations assume what cannot be copied.** Venture capital prices companies on future monopoly-like returns. Software used to offer them: code was hard to write, expertise was hard to hire, and a lead could last years. When the essential idea behind a model can be reproduced and published within days, the durable value moves elsewhere. That can be a gift to users, and a shock to anyone who bought a lead that evaporated.

**When models are cheap, power moves to what is still scarce.** If intelligence itself becomes a commodity, the leverage shifts to the things that are not: chips, data centres, electricity, proprietary data, distribution, and regulatory access. Those are exactly the assets that are already concentrated in a handful of companies and countries. Cheap models could spread capability widely *and* concentrate control of the infrastructure beneath it—both at once.

**Jevons returns.** Cheaper decisions do not mean fewer decisions. At ten queries a second, a single bot plays a video game; at scale, every message, form, and transaction can be scored by a model. Efficiency per call can fall while total computation, energy use, and water demand rise. The planet does not get a discount because each individual call is cheap.

**The automated work is the first rung of the ladder.** Jev and Laya are built for exactly the tasks that start many careers: routing tickets, triaging emails, approving or escalating claims, flagging fraud. Most of us receive our share of society’s wealth through wages. If the value of judgment falls toward the price of electricity, and the gains flow to whoever owns the systems, the main pipe that carries prosperity to ordinary households starts to leak. Productivity growth has not automatically meant wage growth before; nothing about this technology guarantees it now.

**Faces and personalities become inventory.** The creator economy runs on a scarce asset: one real person’s attention, face, and credibility. When one operator can generate many convincing people, that scarcity collapses. Human presence that can be verified may become a premium product, while likenesses—sometimes borrowed without consent—become raw material for someone else’s channel.

**Abundance breaks business models built on metering.** If a capability can run for free on your own machine, the remaining ways to charge for it are lock-in, enclosure, or attention. That creates pressure to close weights, lobby for licensing regimes that only incumbents can meet, or return to the oldest model on the internet: capturing people’s time and selling it.

And that brings us back to the screen in front of you.

## The same loop can help—or hold us

Imagine a student learning how bicycle gears work. An adaptive lesson could offer a diagram, notice a wrong answer, and generate a different explanation. The goal would be to help the student understand, then let them leave.

Change the goal from understanding to time spent, and the same adaptability could work against them. Each response becomes a clue for producing another irresistible item. The system would not need to find an existing video or image; it could generate the next one—and, with a decision model scoring every glance in milliseconds, decide exactly which one.

These are possible uses of the capability, not evidence that every system already works this way. But they expose the choice clearly: **personalization for whose benefit?**

<figure>
  <img class="writing-sketch" src="/writing/2026-09-12-realtime-ai-from-prediction-to-generated-worlds/media/agency-or-attention.avif" alt="Graphite drawing of a person resting beneath a tree, looking over a sunlit mountain valley without a screen." width="480" height="808" loading="lazy" decoding="async" />
  <figcaption>More interaction is not always a better outcome. A useful system should make it easy to finish, stop, or leave.</figcaption>
</figure>

“Infinite content” is not literally free or unlimited; it still needs computation, energy, and infrastructure. The concern is a supply that can keep adapting long after our attention should have moved elsewhere—especially when attention is one of the few things left that cheap intelligence cannot make more of.

I would rather judge a learning system by what someone can do afterward than by how long it kept them looking at a screen. That is a design choice, and a business choice, before it is a model choice.

## Design the rules, not every screen

For interaction designers, the work does not end when a model can produce an attractive interface. It shifts toward deciding what the system may change, what it must preserve, and how a person stays in control.

Four commitments would guide my design:

- **Keep a stable reference point.** Preserve important records, familiar controls, and a shared version of events. Two people may need different views of the same information, not different facts.
- **Make consequential actions explicit.** Show what will change, ask for approval where appropriate, and report what actually happened. In the meeting example, suggesting a time is not permission to send an invitation.
- **Say who—or what—is on the other side.** Label generated people and voices, carry provenance with the media, and never let a synthetic face stand in for a real one without consent.
- **Make correction ordinary.** Let people inspect assumptions, fix errors, undo reversible actions, and return to a familiar interface. Explain clearly when something cannot be undone.

Decision models make one more commitment possible: **show your confidence, and defer when unsure**. A calibrated probability is a gift to good design. Act automatically when the system is confident; hand the uncertain cases to a person, with the reasons visible. That is how automation earns trust rather than demanding it.

These commitments cannot live only in a prompt. A rule saying “respect permissions” is not an access-control system. Durable state, authorization, validation, and accessible controls need to be implemented and tested outside the model’s discretion.

The challenge is not merely drawing every possible screen. It is making an unpredictable screen part of a dependable system.

This also changes what one builder can attempt, without making specialist knowledge expendable. Generating a prototype is not the same as understanding the problem, maintaining the service, or taking responsibility when it fails.

## Choose what deserves to exist

The anxiety around this shift deserves more than reassurance. Making some work easier does not guarantee that the benefits will be shared, or that people whose tasks are automated will find equally good work. Equally, an impressive demonstration does not establish that whole professions are about to disappear. Capability, deployment, and social outcomes are different questions.

And yet, look at what the Jev and Laya story actually shows. A breakthrough did not stay locked inside one well-funded company for years. It spread, in days, to anyone with a laptop and a reason. The same force that unsettles valuations is the force that puts serious tools into the hands of a clinic in a small town, a school without a software budget, a cooperative, a researcher in a country that will never host a frontier lab. Open weights mean you can inspect a model, run it where your data lives, and adapt it to your own language and needs. That is not a footnote. It is a redistribution of capability that no subsidy programme could have achieved.

The question is whether we let our institutions catch up. Some directions worth arguing for:

- **Treat open models as public infrastructure**, the way we once treated roads, libraries, and the web itself—and fund the compute to match.
- **Share productivity gains deliberately**, through shorter working weeks, employee ownership, cooperatives, and public returns on publicly funded research, rather than hoping they trickle down.
- **Price what is actually scarce**—energy, water, attention—so that Jevons works for us instead of against the planet.
- **Measure outcomes, not engagement.** Reward the tool that helps someone finish and leave.

These are choices about ownership, access, incentives, and who gets to say no. They are not inevitable outcomes. But for the first time in a long time, the raw capability is not the bottleneck. Imagination and fairness are.

Imagine a researcher spending less time navigating administrative software. A public service explaining a difficult process without hiding uncertainty. A neighbourhood coordinating shared equipment or energy. A learning tool that helps someone become less dependent on the tool itself. A world you can walk through to understand a place you will never visit.

Realtime AI may let us generate more of the world we encounter. I hope we use that capacity to benefit people, other species, and the environments we share—not simply to fill every remaining moment with something generated, and not simply to make a few owners very rich from something anyone can now copy.

**The point is not to generate everything. It is to give people more power to do what matters—and know when to get out of the way.**
