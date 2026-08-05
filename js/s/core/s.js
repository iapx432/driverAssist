/**
 * s.js - core set based algebraic operator execution engine
 * 
 * intended package consumption:
 * 
 * import { S } from "@openmatrixproject/s-core";
 */

export class S {
    #algebraicOperators;    // a map of standard set algebra operators, with their aliases, names and meanings and implementations
    #debug;                 // optional debug channel 

    constructor(
    ) {
        // initialise the set algebra operator map 
        this.#algebraicOperators = this.#initialiseAlgebraicOperators();

        // initialise the debug channel
        this.#debug = null;
    }

    #initialiseAlgebraicOperators() {

        const algebraicOperators = new Map();

        algebraicOperators.set('∪', {'supported': true, 'alias': null, 'name': 'Union', 'meaning': 'A ∪ B means everything in A or B.', 'implementation': this.#union.bind(this)});
        algebraicOperators.set('∩', {'supported': true, 'alias': null, 'name': 'Intersection', 'meaning': 'A ∩ B means everything common to both A and B.', 'implementation': this.#intersection.bind(this)});

        algebraicOperators.set('∅', {'supported': false, 'alias': null, 'name': 'Empty Set', 'meaning': 'A set containing no elements.'});
        algebraicOperators.set('U', {'supported': false, 'alias': '𝕌', 'name': 'Universal Set', 'meaning': 'The set containing all elements under consideration. Everything is relative to this.'});
        algebraicOperators.set('∈', {'supported': false, 'alias': null, 'name': 'Element Of', 'meaning': 'x ∈ A means x is an element of A.'});
        algebraicOperators.set('∉', {'supported': false, 'alias': null, 'name': 'Not Element Of', 'meaning': 'x ∉ A means x is not in A.'});
        algebraicOperators.set('⊆', {'supported': false, 'alias': null, 'name': 'Subset', 'meaning': 'A ⊆ B means every element of A is also in B.'});
        algebraicOperators.set('⊂', {'supported': false, 'alias': null, 'name': 'Proper Subset', 'meaning': 'A ⊂ B means A is a subset of A but not equal to B.'});
        algebraicOperators.set('⊇', {'supported': false, 'alias': null, 'name': 'Superset', 'meaning': 'A ⊇ B means A contains B.'});
        algebraicOperators.set('⊃', {'supported': false, 'alias': null, 'name': 'Proper Superset', 'meaning': 'A strictly contains B.'});
        algebraicOperators.set('=', {'supported': false, 'alias': null, 'name': 'Equal Sets', 'meaning': 'Same elements, regardless of order.'});
        algebraicOperators.set('≠', {'supported': false, 'alias': null, 'name': 'Not Equal', 'meaning': 'Different elements.'});
        algebraicOperators.set('−', {'supported': false, 'alias': '∖', 'name': 'Difference', 'meaning': 'A − B means everything in A that is not in B. Sometimes ∖.'});
        algebraicOperators.set('△', {'supported': false, 'alias': null, 'name': 'Symmetric Difference', 'meaning': 'A △ B means elements in either set but not both.'});
        algebraicOperators.set('c', {'supported': false, 'alias': null, 'name': 'Complement', 'meaning': 'Ac means everything in the Universal Set except A.'});
        algebraicOperators.set('∣', {'supported': false, 'alias': null, 'name': 'Cardinality', 'meaning': '∣A∣ means the number of elements in A.'});
        algebraicOperators.set('×', {'supported': false, 'alias': null, 'name': 'Cartesian Product', 'meaning': 'A × B means every element of A paired with every element of B.'});

        return algebraicOperators;
    }

    overrideAlgebraicOperator(symbol, implementation) {

        // This capability is intended to allow a different implementation of the same algebraic operator.
        // 
        // The overridden version MUST under all circumstances produce the same result as the non-overridden version,
        // but the means of achieving this may differ for performance, language, library, technology, load sharing or other reasons.
        // 
        // One particular use is to allow certain sets to be held only inside designated security regions.  In this case,
        // the sets which are not sensitive need to be delivered into that region and any sensitive data removed on exit 
        // so that the algebraic operator can be applied to the non-sensitive data, and then the result can be returned to the 
        // calling context for wider participation in the reconciliation of the reasoningContext.
        // 
        // The interface and result must remain consistent with the original implementation.

        const operator = this.#algebraicOperators.get(symbol);
        if (operator) {
            operator.implementation = implementation;
        } else {
            throw new Error(`Attempted override of algebraic operator failed, symbol ${symbol} not known.`);
        }
    }

    reconcile(reasoningContext) {

        // if the reasoningContext contains a reconciliation expression, then evaluate it and return the result as a new set.

        // if not - throw an error, the contract is broken, the reasoningContext should contain a reconciliation expression at this point.

        return new Set();
    }
}