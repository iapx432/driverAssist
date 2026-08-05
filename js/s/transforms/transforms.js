/**
 * projections.js - domain specific projection methods which can be applied to a set.
 * 
 * A transformation of a set produces a new set which contains the original set with the transform method applied.
 * 
 * Base set algebra syntax uses the standard set algebra operators, but the transform methods are domain specific and are not part of the base set algebra syntax.
 * 
 * Example Base Set Algebra Expression:
 * 
 * A ∩ B
 * 
 * Which means produce the intersection of pure set A and pure set B and return a new set containing the result.
 * 
 * Example Base Set Algebra with Transform Expression:
 * 
 * Uses a dot notation to indicate that a transform method is being applied to a set.
 * 
 * Precedence of operations is strictly left to right, so the following expression is evaluated in the following order 
 * 
 * 1) transformMethod 1 is applied to A,
 * 2) transformMethod 2 is applied to the result of transformMethod 1, and
 * 3) the result of transformMethod1 is intersected with set B
 * 
 * A.transformMethod1({supportedMethodParameters}).transformMethod2({supportedMethodParameters}) ∩ B
 * 
 * More specific example:
 * 
 * A0.vectorFieldVelocityTransform(A1) ∩ B
 * 
 * This means that the vectorFieldVelocity transform method is applied to set A, and the result of that transform is intersected with set B, producing a new set containing the result.
 * 
 * This would typically be used where:
 *  
 *      A0 represents a regular grid set of locations and wind speeds at a specific point in time, and 
 *      A1 represents a regular grid set of the same locations and wind speeds at a later point in time. 
 *      The vectorFieldVelocityTransform method would be used to calculate the rate of change of wind speed at each location on the grid.
 * 
 *      This is a first order approximation of a wind speed volatility field.
 * 
 *      The result of the projection is then intersected with set B, which may represent a mask grid to produce only volatilities at certain locations.
 *
 */