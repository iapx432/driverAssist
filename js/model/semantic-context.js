
/**
 * Represents the semantic context of a data object.
 *
 * @typedef {Object} SemanticContext
 * @property {any} Schema - The schema that defines the structure of the data.
 * @property {any} Types - The semantic types that describe the meaning of the data.
 * @property {any} Basis - The basis or reference for the data associativity.
 * @property {any} Lineage - The lineage of the data.
 * @property {any} Provenance - The provenance of the data.
 * @property {any} Constraints - The constraints on the data.
 * @property {any} VisualisationHints - The visualisation hints for the data.
 * @property {any} InstrumentationHints - The instrumentation hints for the data.
 */
export class SemanticContext {

    #Schema = null;
    #Types = null;
    #Basis = null;
    #Lineage = null;
    #Provenance = null;
    #Constraints = null;
    #VisualisationHints = null;
    #InstrumentationHints = null;
}
