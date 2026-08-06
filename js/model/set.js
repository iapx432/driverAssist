import { SemanticContext } from './semantic-context.js';

/**
 * Represents a set of items.
 *
 * @typedef {Object} Set
 * @property {Array<any>} data - The data in the set. [] ... [large multi-dimensional sparse array], just not null
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

    // data.
    // [] | 
    // [1] | 
    // [1,null,<any>] | 
    // [1,null,[2,3,[4,null,6],<any>]]

    // data cannot be null.
    // data may contain no items.
    // if data contains not items, there must not be any semanticContext items at that dimensional level.
    // if data contains items, they must directly correspond to the semanticContext at that dimensional level.

    // semanticContext
    // [] | 
    // [Semantics] | 
    // [Semantics,[Semantics],Semantics] | 
    // [Semantics,[Semantics,Semantics,[Semantics,Semantics],Semantics]],Semantics]

    // semanticContext cannot be null.
    // semanticContext may contain no items.
    // if semanticContext contains no items, there must not be any data items at that dimensional level.
    // if semanticContext contains items, they must directly correspond to the data at that dimensional level.

    // Each distinguishable semantic region has exactly one semantic interpretation.

    // The semantics must always be able to completely interpret the data,
    // and the structure of the data must determine exactly which semantic interpretation applies at every semantic boundary.
    // That's saying there is a bijection of interpretation.

    setData(data) {
        // write all the ASSETS, exceptions to protect invariant AL-I-001

        // Ensure that the data is an array
        if (!Array.isArray(data)) {
            throw new Error('Set.data must be an array.');
        }
        this.#data = data;
    }

    getData() {
        return this.#data;
    }

    setSemanticContext(semanticContext) {
        // write all the ASSETS, exceptions to protect invariant AL-I-001

        this.#semanticContext = semanticContext;
    }    

    getSemanticContext() {
        return this.#semanticContext;
    }
}
