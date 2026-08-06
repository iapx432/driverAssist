/**
 * canonical polyLine representation
 * 
 * A polyLine is an array containing a single set of Points (vertices) which are connected to form one continuous path.
 * 
 * Discontinuous sets of Points would constitute multiple PolyLines and should be represented as an array of PolyLines.
 * 
 * PolyLines may be open or closed. A closed polyLine is one where the first and last points have the same coordinates. A closed polyLine may be used to represent a polygon or a circle for example.
 * 
 * A polyLine with a single Point is valid but should be modelled as a Point instead.
 * 
 * A polyLine with two Points is valid and represents a single line segment.
 * 
 * A polyLine with three or more Points is valid and represents a multi-segment path.
 * 
 * A polyLine with no points is invalid and should be represented as null.
 *
 * @al_entityType PolyLine
 * @al_contains Point
*/

export class PolyLine {
    points = [/* canonicalPoints */];
}