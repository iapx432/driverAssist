# (Incomplete) Notes on the reasoning process

## reasoning context contract

## Observability

Produces evidence which can be used to audit, debug, tune and explain the reasoning dialogue

For example should enable visibility of reasoning state:

Conversation

✓ Digest complete

✓ Plan generated

✓ Needs:
    CurrentRoute
    WeatherAlongRoute

✓ Cache hit:
    CurrentRoute

✓ API call:
    Weather

✓ Context assembled
    3.4 KB

✓ LLM call
    1.2 s
    2,140 tokens

✓ Response received

## Contract

ReasoningRequest example

Goal
    Compare alternative routes

Needs
    CurrentRoute
    VehicleProfile
    GradientProfile

Optional
    WeatherAlongRoute

Operations
    Compare
    Rank
    Summarise

Constraints
    Explain assumptions
    State confidence

Should Have Granular Reproducibility so that different LLM versions / back-ends can be evaluated

question:
  "Can I avoid the steep hills?"

plan:
  needs:
    - CurrentRoute
    - GradientProfile
    - VehicleProfile

acquired:
  CurrentRoute: cache
  GradientProfile: ors
  VehicleProfile: settings

reasoning_context:
  ...

result:
  ...

cost:
  llm_tokens: 1832
  api_calls: 2
  elapsed: 1.7s

## Pipeline

Question
    ↓
Digest
    ↓
Information Requirements
    ↓
Data Acquisition
    ↓
Reasoning Context
    ↓
Inference
    ↓
Answer

## Declarative Dialogue

The LLM is asked to describe the information capabilities it requires in order to produce exchange planning information, set algebra etc.

digest:

needs:

assumptions:

operations:

expected_output: