# DriverAssist Architectural Language (DAL)

## Purpose

DriverAssist uses a small set of architectural annotations embedded within source code comments to describe the intended structure of the system.

These annotations are **not** part of the executable code. Instead, they provide machine-readable architectural metadata that can be used to generate documentation and validate the architecture as it evolves.

The annotations are intentionally few in number. New annotations should only be introduced when they represent a recurring architectural concept rather than a one-off implementation detail.

Architectural annotations may be used to:

- Generate architecture documentation.
- Generate Mermaid diagrams.
- Produce dependency and transformation reports.
- Create architectural unit tests.
- Assist AI coding tools in understanding DriverAssist's architectural language.
- Support impact analysis when classes or relationships change.

# Referencing

The architecture language uses an annotation referencing scheme to classify types of annotations that fulfil different purposes.  These are shown below.  The definitions of the language are held separately from the references to them which are held in code and other source files.

## Scheme

A three part identifier is used to identify an architecture documentation reference.

AL-{type}-{id}

For example AL-I-1 

### Type I: Invariant

A definition which if changed would undermine the basis of the concept.  An Invariant must only be updated if all the architectural implications have been verified.

---

# Core

The architectural core attributes define the key meanings of foundational elements and are designed to be represented as a graph and inspectable.

## `@al_invariant AL-I-{id}`

A reference to invariant document {id}.

### Example

```javascript
/**
 * @al_Invariant AL-I-1
 */
export class SemanticSet {

}
```

---

---

# Entity Types

Entity Types describe the architectural role of a class.

## `@al_entityType Canonical`

A Canonical entity represents DriverAssist's internal representation of information.

Canonical entities are independent of external providers and form the stable language used throughout the application.

### Example

```javascript
/**
 * @al_entityType Canonical
 */
export class CanonicalSpatialReference {

}
```

---

## `@al_entityType Provider`

A Provider entity represents information originating from an external system or service.

Provider entities preserve the provider's representation without modification.

### Example

```javascript
/**
 * @al_entityType Provider
 */
export class MapTilerSpatialReference {

}
```

---

## `@al_entityType Transformer`

A Transformer converts one architectural representation into another.

Transformers should contain no long-term state.

### Example

```javascript
/**
 * @al_entityType Transformer
 */
export class ProviderSpatialReferenceToCanonicalTransformer {

}
```

---

# Relationship Types

Relationship Types describe how architectural entities are related.

## `@al_contains`

Indicates that one entity directly contains references to another entity.

This represents structural ownership rather than temporary local variables or method parameters.

May be used to generate:

- Containment diagrams
- Architectural documentation
- Dependency reports

### Example

```javascript
/**
 * @al_contains Point
 */
points = [];
```

or

```javascript
/**
 * @al_contains PolyLine
 */
items = [];
```

---

## `@al_transformsTo`

Indicates that a Transformer converts one architectural entity into another.

This annotation should normally appear alongside a corresponding `@dependsOn` or explicit input annotation in future revisions.

May be used to generate:

- Transformation graphs
- Provider-to-canonical mappings
- Architectural completeness tests

### Example

```javascript
/**
 * @al_transformsTo CanonicalSpatialReference
 */
export class ProviderSpatialReferenceToCanonicalTransformer {

}
```

---

## `@al_transformsFrom`

Indicates that a Transformer converts From one architectural entity into another.

This annotation should normally appear alongside a corresponding `@al_dependsOn` or explicit input annotation in future revisions.

May be used to generate:

- Transformation graphs
- Provider-to-canonical mappings
- Architectural completeness tests

### Example

```javascript
/**
 * @al_transformsFrom ProviderSpatialReference
 */
export class ProviderSpatialReferenceToCanonicalTransformer {

}
```

---

## `@al_dependsOn`

Indicates that an entity has a direct architectural dependency on another entity.

This represents a design dependency rather than a temporary runtime interaction.

May be used to generate:

- Dependency graphs
- Layer validation
- Circular dependency detection

### Example

```javascript
/**
 * @al_dependsOn CanonicalSpatialReference
 */
export class Feature {

}
```

---

# Design Principles

Architectural annotations should describe **architectural intent**, not implementation detail.

Good examples include:

- containment
- ownership
- transformation
- dependency

Poor examples include:

- loop variables
- temporary objects
- algorithm steps
- implementation decisions

The architectural model generated from these annotations should remain stable even if the implementation changes internally.