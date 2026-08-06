# DriverAssist Architectural Constraints

## Purpose

Provides the architectural equivalent of unit-tests for code. This is designed to be interpretable and/or actionable by code, humans and AI.

# Rules

## Rule 1

### Name

Transformer consumes Provider

### Description

Every entity with

@al_entityType Transformer

shall declare exactly one

@al_transformsFrom

whose target entity has

@al_entityType Canonical

### Reason

Transformers provide the boundary between provider representations and DriverAssist's canonical model.

### Severity

Error

## Rule 2

### Name

Transformer produces Canonical

### Description

Every entity with

@al_entityType Transformer

shall declare exactly one

@al_transformsTo

whose target entity has

@al_entityType Canonical

### Reason

Transformers provide the boundary between provider representations and DriverAssist's canonical model.

### Severity

Error

## Rule 3

Constraint: Canonical entities shall not depend on Provider entities.  They may reference them for provenance purposes.

Severity: Error

