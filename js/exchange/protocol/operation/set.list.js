/**
 * SetListOperation is a class that represents an operation to retrieve a list of the available sets.
 * 
 * The SetListOperation class takes a catalogue and an exchange language as parameters in its constructor. The catalogue is used to access the data, while the exchange language defines the structure and semantics of the requests.
 */

export class SetListOperation {
    #catalogue;
    #exchangeLanguage;
    constructor(catalogue, exchangeLanguage) {
        this.#catalogue = catalogue;
        this.#exchangeLanguage = exchangeLanguage;
    }

    execute(executionContext) { 

        executionContext.response.result.items.push(...this.#catalogue.setNames());
    }
}