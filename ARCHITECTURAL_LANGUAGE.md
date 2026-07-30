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

---

# Entity Types

Entity Types describe the architectural role of a class.

## `@dal_entityType Canonical`

A Canonical entity represents DriverAssist's internal representation of information.

Canonical entities are independent of external providers and form the stable language used throughout the application.

### Example

```javascript
/**
 * @dal_entityType Canonical
 */
export class CanonicalSpatialReference {

}
```

---

## `@dal_entityType Provider`

A Provider entity represents information originating from an external system or service.

Provider entities preserve the provider's representation without modification.

### Example

```javascript
/**
 * @dal_entityType Provider
 */
export class MapTilerSpatialReference {

}
```

---

## `@dal_entityType Transformer`

A Transformer converts one architectural representation into another.

Transformers should contain no long-term state.

### Example

```javascript
/**
 * @dal_entityType Transformer
 */
export class ProviderSpatialReferenceToCanonicalTransformer {

}
```

---

# Relationship Types

Relationship Types describe how architectural entities are related.

## `@dal_contains`

Indicates that one entity directly contains references to another entity.

This represents structural ownership rather than temporary local variables or method parameters.

May be used to generate:

- Containment diagrams
- Architectural documentation
- Dependency reports

### Example

```javascript
/**
 * @dal_contains Point
 */
points = [];
```

or

```javascript
/**
 * @dal_contains PolyLine
 */
items = [];
```

---

## `@dal_transformsTo`

Indicates that a Transformer converts one architectural entity into another.

This annotation should normally appear alongside a corresponding `@dependsOn` or explicit input annotation in future revisions.

May be used to generate:

- Transformation graphs
- Provider-to-canonical mappings
- Architectural completeness tests

### Example

```javascript
/**
 * @dal_transformsTo CanonicalSpatialReference
 */
export class ProviderSpatialReferenceToCanonicalTransformer {

}
```

---

## `@dal_transformsFrom`

Indicates that a Transformer converts From one architectural entity into another.

This annotation should normally appear alongside a corresponding `@dal_dependsOn` or explicit input annotation in future revisions.

May be used to generate:

- Transformation graphs
- Provider-to-canonical mappings
- Architectural completeness tests

### Example

```javascript
/**
 * @dal_transformsFrom ProviderSpatialReference
 */
export class ProviderSpatialReferenceToCanonicalTransformer {

}
```

---

## `@dal_dependsOn`

Indicates that an entity has a direct architectural dependency on another entity.

This represents a design dependency rather than a temporary runtime interaction.

May be used to generate:

- Dependency graphs
- Layer validation
- Circular dependency detection

### Example

```javascript
/**
 * @dal_dependsOn CanonicalSpatialReference
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