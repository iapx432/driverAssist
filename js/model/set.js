import { SemanticContext } from './semantic-context.js';

/**
 * Represents a set of items.
 *
 * @typedef {Object} Set
 * @property {Array<any>} data - The data in the set. [] | [1] | [1,null,<any>] | [1,null,[2,3,[4,null,6],<any>]] - [] ... [large multi-dimensional sparse array], just not null
 *                               This may need typescript to force semantic mapping certainty and defend against inadmissible data structures.
 * @property {any} semanticContext - The semantics of the set.  Matching the data structure, but containing the semantic meaning of each item.
 * @method setData(data) - Sets the items in the set.
 * @method setSemanticContext(semanticContext) - Sets the semantics of the set.
 * @method getData() - Gets the items in the set.
 * @method getSemanticContext() - Gets the semantics of the set.
 * 
 * @al_invariant AL-I-001: The semantic topology shall be recursively congruent with the data topology. The data and semanticContext must be consistent with each other.  The semanticContext must accurately describe the meaning of the data.
 */
export class Set {
    #data = [];
    #semanticContext = [];

    // write all the ASSETS, exceptions to protect invariant AL-I-001

    // this is foundational to the semantic model, and is a key part of the semantic model's ability to provide a consistent and accurate representation of the data's meaning.
    // and its ability to reason, transport, group, and dynamically re-group units of semantic computation.
    // this model pairs the data and its semantic meaning.
    // other models interleave the data and its semantic meaning
    // or simply have the data and the semantic meaning is in the code as a separately correlated expression.

    // The semantic topology shall be recursively congruent with the data topology
    // Every semantic boundary corresponds to exactly one data boundary 
    // This results in recursive isomorphism between the data and semanticContext structures, ensuring that the semanticContext accurately describes the meaning of the data.

    setData(data) {
        // Ensure that the data is an array
        if (!Array.isArray(data)) {
            throw new Error('Set.data must be an array.');
        }
        this.#data = data;
    }

    setSemanticContext(semanticContext) {
        this.#semanticContext = semanticContext;
    }

    getData() {
        return this.#data;
    }

    getSemanticContext() {
        return this.#semanticContext;
    }
}
