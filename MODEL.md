# Spatial Model

## Constitution of the model

Principle: Knowledge is immutable.
Principle: Goals provide purpose, not truth.
Principle: Claims are supported by substantiation.
Principle: Reasoning contexts are immutable.
Principle: Conversation creates new reasoning contexts.

## Principle: Purpose and Knowledge

The spatial model represents knowledge about the world.

A Goal represents purpose.

Knowledge should not be shaped by purpose, and purpose should not alter
knowledge.

Reasoning emerges from the interaction between the two; like a light shining on a landscape.

## Vocabulary

Principle: Stable Vocabulary

Driver Assist reasons using its own domain vocabulary.

Provider knowledge remains provider-native.

The vocabulary interprets provider knowledge into stable concepts that support reasoning.

Providers may change independently of the vocabulary, and the vocabulary may evolve independently of providers.

## Reasoning Context

Driver Assist is not a route planner. It is a conversational reasoning system that helps a traveller negotiate movement through the world.

Reasoning does not occur over the whole world.

Reasoning occurs within a context.

A context combines:

- Purpose (Goal)
- Knowledge (Selection)
- Assumptions
- Constraints
- Confidence

The context evolves as new observations arrive and as goals change.
## Design Notes

                    Real World
                         │
                    Observation
                         │
                    Acquisition
                         │
                    Translation
                         │
                   Spatial Model
                         │
        ┌────────────────┴───────────────┐
        │                                │
   Computational                       Human
     Reasoning                        Reasoning
        │                                │
        └──────────────┬─────────────────┘
                       │
                   Narrative

The purpose of this model is not to represent the world. It is to support a conversation between a traveller and the world. The model should therefore preserve enough truth, provenance and structure that the system can both reason correctly and explain that reasoning in terms a person naturally understands.

Provider-specific information is preserved only when it cannot be translated into a canonical domain representation.

A Feature requires a way of locating it in space so has a spatial presence.

Current working concept:
Location

The spatial model uses geographic coordinates as its canonical representation.

Decision: The canonical representation of place within the spatial model is Location.

Which describes where a Feature exists in the mapping, not projection world. Some sources may provide only latitude and longitude, while others may include vertical information but this may vary in meaning depending on the source so may be height not vertical position or elevation.

Alternatives considered:
- SpatialFootprint
- Anchor

Reason for choosing Location:
It answers today's questions without introducing unnecessary abstraction.

Revisit if we discover Features that cannot be located spatially.

## Core Principles

- When the architectural gradient becomes shallow, stop coding and ask a better question.
- Every architectural addition should maximise future expressive power while minimising premature commitment
- Maximise the system's ability to answer meaningful journey questions and explain the answers.
- Acquisition and reasoning are separate.
- Providers populate repositories.
- Repositories expose features.
- Features are immutable.
- Graphs describe traversability.
- Reasoning never modifies acquisition data.

## Questions

### Question 1

What is the smallest domain concept?

Answer:
Feature.

---

### Question 2

What is the first property every Feature requires?

Answer:
source

Reason:
Every acquired observation has provenance.

---

### Question 3

What is the identity of the feature?

Answer:
sourceId. If available. Because this defines what the source provider knows this feature uniquely is, whether or not driverAssist assigns it a new id and this allows it to be correlated to existing or new data from the provider for change delta detection (new, same, updated, removed). 

### Question 4 (collection)

What can I travel on?
Why can't I travel here?
What evidence supports this?
What alternatives exist?
What changed?
What features are relevant to my journey?
What observations support this conclusion?

