# DriverAssist Architecture

## Purpose

This document is the architectural entry point for the DriverAssist project.

It defines the architectural contract for the system and establishes the documents that collectively describe the intended architecture.

When reasoning about, modifying or extending DriverAssist, this document and the documents referenced below should be considered together as a single architectural specification.

---

# Architectural Contract

The DriverAssist architectural contract consists of the following documents.

## ARCHITECTURE_LANGUAGE.md

Defines the DriverAssist Architectural Language (DAL).

The language provides a small, stable vocabulary for expressing architectural intent directly within source code through architectural annotations.

The language is intended to be understood by humans, AI assistants and software tooling.

---

## ARCHITECTURE_CONSTRAINTS.md

Defines the architectural constraints that valid DriverAssist implementations are expected to satisfy.

These constraints represent architectural invariants rather than implementation details.

Constraints may be evaluated during editing, analysis, continuous integration or any future architectural validation process.

---

## ARCHITECTURE_DECISIONS.md

Captures significant architectural decisions that influence the evolution of DriverAssist.

Decisions explain *why* the architecture has taken its current form and provide context that cannot always be inferred from the language or constraints alone.

---

# Intended Consumers

The architectural contract is intended to be consumed by:

- Developers
- AI coding assistants
- Documentation generators
- Architectural analysis tools
- Graph analysis tools
- Future architectural validation tools

All consumers should interpret these documents as complementary parts of a single architectural specification.

---

# Guiding Principle

DriverAssist treats architecture as a first-class engineering artefact.

The architecture is intended to participate in software development rather than simply describe it.

Architectural information should therefore be:

- human-readable
- AI-readable
- machine-readable
- stable under implementation change
- suitable for automated analysis
- suitable for architectural validation
- suitable for future graph-based exploration and discovery

The architectural model generated from the source code should become the canonical representation of the system's architectural intent.

# Architectural Drivers

Reduce the Cost of Understanding.
Preserve semantic meaning across implementation change.
Maximise orthogonality.
Make uncertainty visible before implementation.
Make architectural judgement inspectable.
Reduce irreversible decisions.
Support incremental adoption into existing estates.

Capabilities are considered when they answer "Which architectural driver does this strengthen?"

# Architectural Metaphore

This description is intended to describe the kind of reasoning stages and separation which this project can be compared with in a simplified form but applied to a completely different domain.

There are parallels which are useful illustrations to show why certain architectural approaches have been used and what purpose they serve.

## Methphore: The Esperanto Chef

My eye sight is not very good but I heard on a local radio station that a new restaurant has opened which deliver Japanese food.  The review was very good so I thougth I would give it a go and order something.  I can speak passable Japanese so I decided to ring them up and ask them about the menu.  I have a few dietry requirements which need to be met but I could discuss them with the staff and ask for their advice on choosing a dish as I am not really familiar with Japanese dishes and don't know their menu.

When I rang, I was told that te only person who could answer my questions was the head chef who was happy to talk to me but who only spoke esperanto.

I have only a basic knowledge of esperanto and certainly not enough to explain my dietry requirements and discuss the range of dishes on the menu.

However, I have a friend who is really good at languages so I rang her up and asked if she would mind ringing the restaurant on my behalf to talk to the chef.  She knows all about my dietry needs and I explained the kinds of tastes I like so she would be able to have that discussion and I'd be happy to try a dish she had selected.

When I told her that the chef could only speak esperanto she said she didn't know it but she was multilingual.  I told her about a book I have which gives a crash course in basic esperanto.  She then said she was on a noisy train so she could not directly have the conversation with the chef but would message me the things to say once she had downloaded the book.  After an hour she said she had enough of a grasp of the language and said I would have to ask a few questions for her and once she had the answers she wou dthen be able to select an appropriate dish.

Before she rand I said I only had £13 so could she select a meal with that price limit.

She messaged me a few phrases,
I rang the restaurant asked to speak to the chef and used the message to voice app and so the chef could hear,
I recorded the responses and relayed them to my friend,
She sent me some more messages and I repeated this process a few times until my friend said that she had enough information and had selected a dish.

I ended the conversation with the chef and my friend said that the meal would arrive in 45mins but would be accompanied by the recipe and a menu which described the ratings of restaurant on dietry status of each meal. 

## Parallels

Friend: LLM
Book on esperanto: Exchange Language and associated vocabulary, giving the ability to ask questions whose results will lead to refinement of questioning until the goal exit criteria are reached.
Chef's Telephone Receiver: exchange interface
Esperanto messages: "Of the dishes that do not contain peanuts, which can be prepared the quickest?" could be represented as Set.temporal.order.descending.top.1(Set A intersect Set B)
Me: mediating application
Dish: Route
Price: User Journey Constraint: e.g. Gradient Limit
Dietry Requirements: User Preferences
Repeated Cycles of Messages with friend: Send goal statement to LLM and provide any base information asked for to support the reasoning discovery process.
Subsequent Messages send to chef: Refinement from asking about types of thing to finding instances of information which support goal resolution (routes with options plus advisory information, metric etc).
