import { SemanticContext } from './semantic-context.js';

/**
 * Represents a set of items.
 *
 * @typedef {Object} Set
 * @property {Array<any>} data - The items in the set.
 * @property {any} semanticContext - The semantics of the set.  Matching the data structure, but containing the semantic meaning of each item.
 * @method setData(data) - Sets the items in the set.
 * @method setSemanticContext(semanticContext) - Sets the semantics of the set.
 * @method getData() - Gets the items in the set.
 * @method getSemanticContext() - Gets the semantics of the set.
 */
export class Set {
    #data = [];
    #semanticContext = null;

    setData(data) {
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
