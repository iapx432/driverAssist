/**
 * SetGetOperation is a class that represents an operation to retrieve a set of data from the catalogue based on the provided request. It is part of the exchange protocol and is responsible for executing the request and returning the corresponding response.
 * 
 * The SetGetOperation class takes a catalogue and an exchange language as parameters in its constructor. The catalogue is used to access the data, while the exchange language defines the structure and semantics of the requests.
 */

export class SetGetOperation {
    #catalogue;
    #exchangeLanguage;
    constructor(catalogue, exchangeLanguage) {
        this.#catalogue = catalogue;
        this.#exchangeLanguage = exchangeLanguage;
    }

    execute(executionContext) { 

        // the catalogue should be the place where concept terms are mapped to catalogue items.
        
        // add the items from the this.#catalogue.properties() array to the executionContext.response.result.items array
        executionContext.response.result.items.push(...this.#catalogue.properties());
    }
}