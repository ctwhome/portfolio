---
layout: ../../../layouts/WritingLayout.astro
title: "Realtime AI: From Prediction to Generated Worlds"
description: "What changes when AI generates the interface, not just the answer? A look at worlds we can steer, tools made for one moment, and the things we should refuse to improvise."
date: "2026-09-12"
category: "Digital Garden"
cover: "/writing/2026-09-12-realtime-ai-from-prediction-to-generated-worlds/media/cover.avif"
coverAlt: "A cursor moving from a fixed interface grid into a fluid generated world"
coverWidth: 1600
coverHeight: 900
---
It clicked for me when I watched a computer generate its next screen instead of opening an application.

Google’s [neural operating system prototype](https://developers.googleblog.com/en/simulating-a-neural-operating-system-with-gemini-2-5-flash-lite/) looks like a desktop. Click an icon, and a language model generates the interface. Interact again, and it generates another screen, using your action, context, and a set of rules. It is a research demonstration, not a replacement for macOS or Windows. But it changes the question from *“What can this application do?”* to *“What interface would help me now?”*

That possibility excites me. It also makes me uneasy. A system that can generate what we need could just as easily generate whatever keeps us occupied.

The interesting question is not whether we can make more content. It is what happens when generation becomes part of the way we act.

## What actually changes

Software already adapts to us. Search results change, dashboards update, and games respond to our movement. The distinction is not that yesterday’s software was static. It is **how much of the next experience is designed in advance, and how much is generated during use**.

[Inference](https://cloud.google.com/discover/what-is-ai-inference) means running a trained model on new input to produce an output. It includes both predictions and generated content; it does not necessarily happen in realtime. Here, I use *realtime AI* for generation that responds quickly enough to become part of an ongoing interaction.

The loop is simple: **you act → the system generates → you respond**. Instead of being the end of a request, the output becomes the starting point for your next action.

<figure>
  <img src="/writing/2026-09-12-realtime-ai-from-prediction-to-generated-worlds/media/interaction-loop.svg" alt="A cursor leads to a generated interface, then to a new scene; a returning arrow closes the interaction loop." width="1200" height="520" loading="lazy" decoding="async" />
  <figcaption>You act. The system generates. You respond. The result becomes part of the next interaction, rather than a finished artefact.</figcaption>
</figure>

Speed matters, but so does continuity. A screen that appears quickly is not useful if it forgets what you just did. Google’s desktop prototype explored caching previously generated screens so revisiting one did not mean reinventing it.

Nor is every generative interface realtime. In its November 2025 [generative UI report](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/), Google showed custom tools and simulations, but noted that generation could take a minute or more. That is evidence for generating an experience, not proof that every experience is already instantaneous.

## From a picture to a world you can steer

A generated picture gives you one view. An interactive world lets you turn around and ask, through movement, what is behind you.

[Oasis](https://oasis-model.github.io/), introduced by Decart and Etched in 2024, demonstrated a Minecraft-like environment generated frame by frame from player input. Rather than using a conventional game engine to determine what happens, the model predicts the next visual state. Its authors also describe the cost: errors accumulate, and the world can lose consistency.

In its August 2025 [Genie 3 announcement](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/), Google DeepMind reported interactive environments at 720p and 24 frames per second, with consistency lasting a few minutes. It also described unreliable actions and limits on continuous interaction. Those qualifications matter as much as the impressive footage.

World Labs’ [Atlas](https://www.worldlabs.ai/blog/atlas) explores a related problem: grounding generated views in 3D space. These are different approaches, not interchangeable products or a single ladder of progress. Together, they make a new kind of interaction easier to imagine: you do not just request a scene; you help determine what happens next.

But a convincing world is not necessarily a reliable simulation. A generated bridge might look plausible while teaching you nothing trustworthy about whether a real bridge would stand. Visual coherence and physical validity are different requirements.

## A tool for one moment

The more immediate possibility may be less spectacular than a generated world: a small interface that exists only because you need it.

Imagine arranging a meeting with three colleagues. Rather than moving between calendars and messages, you ask: *“Find a time next week when everyone is free.”* A compact comparison appears. You exclude mornings. It updates. You choose a slot and approve the invitation.

This is a design scenario, not a claim that a particular product handles the whole task reliably today. Its appeal is simple: the interface follows the decision instead of making you learn an application first.

But notice what must **not** be generated: people’s actual availability, their permissions, or whether an invitation was sent. Those facts must come from connected systems and confirmed results. The layout may be temporary; the records cannot be imaginary.

<figure>
  <img src="/writing/2026-09-12-realtime-ai-from-prediction-to-generated-worlds/media/stable-foundations.svg" alt="Two different interface sketches sit above the same solid foundation, supported by a database, a lock, and a confirmed record." width="1200" height="600" loading="lazy" decoding="async" />
  <figcaption>Let the interface adapt. Keep the foundations dependable: real records, enforced permissions, and actions whose results can be checked.</figcaption>
</figure>

This is why I do not expect permanent software simply to disappear. Shared documents, specialist tools, infrastructure, and familiar places still need continuity. Generating a different menu every morning would often be worse, not better.

The useful distinction is between **what can adapt** and **what people need to rely on**. Perhaps we will need fewer fixed screens around some tasks. That does not mean we need less engineering underneath them.

## The same loop can help—or hold us

Now imagine a student learning how bicycle gears work. An adaptive lesson could offer a diagram, notice a wrong answer, and generate a different explanation. The goal would be to help the student understand, then let them leave.

Change the goal from understanding to time spent, and the same adaptability could work against them. Each response becomes a clue for producing another irresistible item. The system would not need to find an existing video or image; it could generate the next one.

These are possible uses of the capability, not evidence that every system already works this way. But they expose the choice clearly: **personalization for whose benefit?**

<figure>
  <img src="/writing/2026-09-12-realtime-ai-from-prediction-to-generated-worlds/media/agency-or-attention.svg" alt="On the left, arrows circle an endless stack of content cards. On the right, a path leads through an open door and out of the system." width="1200" height="560" loading="lazy" decoding="async" />
  <figcaption>More interaction is not always a better outcome. A useful system should make it easy to finish, stop, or leave.</figcaption>
</figure>

“Infinite content” is not literally free or unlimited; it still needs computation, energy, and infrastructure. The concern is a supply that can keep adapting long after our attention should have moved elsewhere.

I would rather judge a learning system by what someone can do afterward than by how long it kept them looking at a screen. That is a design choice, and a business choice, before it is a model choice.

## Design the rules, not every screen

For interaction designers, the work does not end when a model can produce an attractive interface. It shifts toward deciding what the system may change, what it must preserve, and how a person stays in control.

Three commitments would guide my design:

- **Keep a stable reference point.** Preserve important records, familiar controls, and a shared version of events. Two people may need different views of the same information, not different facts.
- **Make consequential actions explicit.** Show what will change, ask for approval where appropriate, and report what actually happened. In the meeting example, suggesting a time is not permission to send an invitation.
- **Make correction ordinary.** Let people inspect assumptions, fix errors, undo reversible actions, and return to a familiar interface. Explain clearly when something cannot be undone.

These commitments cannot live only in a prompt. A rule saying “respect permissions” is not an access-control system. Durable state, authorization, validation, and accessible controls need to be implemented and tested outside the model’s discretion.

The challenge is not merely drawing every possible screen. It is making an unpredictable screen part of a dependable system.

This also changes what one builder can attempt, without making specialist knowledge expendable. Generating a prototype is not the same as understanding the problem, maintaining the service, or taking responsibility when it fails.

## Choose what deserves to exist

The anxiety around this shift deserves more than reassurance. Making some work easier does not guarantee that the benefits will be shared, or that people whose tasks are automated will find equally good work. Equally, an impressive demonstration does not establish that whole professions are about to disappear. Capability, deployment, and social outcomes are different questions.

I want to use these tools without confusing greater output with greater progress.

Imagine a researcher spending less time navigating administrative software. A public service explaining a difficult process without hiding uncertainty. A neighbourhood coordinating shared equipment or energy. A learning tool that helps someone become less dependent on the tool itself.

Those are directions worth pursuing, not inevitable outcomes. They require choices about ownership, access, incentives, and who gets to say no.

Realtime AI may let us generate more of the world we encounter. I hope we use that capacity to benefit people, other species, and the environments we share—not simply to fill every remaining moment with something generated.

**The point is not to generate everything. It is to give people more power to do what matters—and know when to get out of the way.**
