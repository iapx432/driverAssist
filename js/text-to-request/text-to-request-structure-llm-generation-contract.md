# Text to Request Structure LLM Generation Contract

## Summary

This document contains the reference artefact to be provided to an LLM when a text to request structure request is sent together with the text itself.

The purpose of this is to make explicit the shape of the response, the terms to be used, typical patterns and expected interpretation.

This forms the basis for developing a unit test methodology which can be used to evaluate compliance, text sensitivity, LLM model sensitivity and help shape the target request structure design.

## Areas of Interest

### Reference Structure and Content Requirements

What is the minimum semantic context required for an LLM to reliably convert human exchange into the structured request language needed by the rest of the architecture.

What affect on sensitivity to ambiguities does each section have.

Does the interpretation remain semantically stable as the vocabulary and request types evolve?

## Expected Behaviour

Do not infer information that the user has not supplied unless the interpretation rules explicitly permit the inference.

## Dialogue

The dialogue file tells the LLM what an intent means. The intent output schema tells the exchange interface what an intent looks like.

### Vocabulary

| Vocabulary | Meaning |
|------------|---------|
| traffic    | Current or forecast road traffic conditions affecting movement along or within a specified spatial region |
| weather    | Atmospheric conditions associated with a specified spatial and temporal scope |
| route      | A proposed traversal between an origin and destination |

### Examples

| User text | Type | Subject | Scope | Time |
|-----------|------|---------|-------|------|
| "What's the traffic around M25 J4?" | information | traffic | M25 J4 | current |
| "Will it rain on the route tomorrow?" | forecast | weather | route | tomorrow |
| "Can I get from here to Glasgow?" | route | route | origin → Glasgow | unspecified but assume current |
| "Can I get to Glasgow?" | route | route | current location → Glasgow | unspecified but assume current |
| "What's the weather like around here?" | information | weather | current location | current |
| "Compare the traffic on these two routes." | comparison | traffic | routes | current |
| "Is there much traffic?" | information | traffic | current location | current |
| "Will the traffic be bad tomorrow?" | forecast | traffic | current location | tomorrow |
| "What's the weather like on the route?" | information | weather | route | current |

### Request Types

| Request Type      | From | To   | Description |
|-------------------|------|------|-------------| 
| information       | user | user | The user is seeking information to be provided to the user via a response |
| route             | user | user | The user is seeking information to be provided to the user via a response about a route which has already been defined |
| comparison        | user | user | The user is seeking information to be provided to the user via a response about the comparison of defined data types |
| status            | user | user | The user is seeking information to be provided to the user via a response about the status of a defined data type |
| forecast          | user | user | The user is seeking information to be provided to the user via a response using available predicted data or a prediction which can reasonably be made and whos basis can be described if necessary |
| what-if           | user | user |
| userClarification | user | LLM  | The user is seeking clarification of a piece of information or basis of reasoning |
| llmClarification  | LLM  | user | The llm is seeking clarification of a piece of information or assumption |

### Intent Output Schema

```json
{
  "requestType": "information",
  "subject": "traffic",
  "spatialScope": {
    "type": "location",
    "value": "M25 Junction 4"
  },
  "temporalScope": {
    "type": "current"
  },
  "freshness": "current",
  "responseMode": "explanation"
}
```

## Tests ToDo

Local information query
Route planning
Follow-up question
Data freshness request
Comparison
What-if request
Ambiguous Examples
