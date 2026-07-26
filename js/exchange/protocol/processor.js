import { Catalogue } from "../../model/catalogue.js";
import { Set } from "../../model/set.js";
import { Request } from "./request.js";
import { Response } from "./response.js";
import { ExecutionContext } from "./execution-context.js";
import { SetGetOperation } from "./operation/set.get.js";
import { SetListOperation } from "./operation/set.list.js";

export class ExchangeProcessor {
    #catalogue;
    #exchangeLanguage;

    constructor(catalogue, exchangeLanguage) {
        this.#catalogue = catalogue;
        this.#exchangeLanguage = exchangeLanguage;
    }
    execute(request) {

        const startTimeMs = performance.now();
        if (request.metadata === undefined) {
            request.metadata = { executionStartTimeMs: startTimeMs };
        } else {
            request.metadata.executionStartTimeMs = startTimeMs;
        }

        // create the response
        const response = new Response();

        // fill the response with an empty set for now, to be populated by the request execution
        const set = new Set();
        response.result = set;

        // request in response for traceability
        response.request = request;

        // create the execution context to track the request fulfillment journey
        const executionContext = new ExecutionContext();
        executionContext.request = request;
        executionContext.response = response;

        // validate the request against the exchange language
        // find the id property of one of the requests in the #exchangeLanguage.requests."name" has an id == request.request
        executionContext.requestDefinition = Object.values(this.#exchangeLanguage.requests).find(r => r.id === request.request);

        try {
            if (!executionContext.requestDefinition) {
                response.messages.push(`Unknown request: ${request.request}`);
                // get a list of all the request names in the exchange language
                const requestNames = Object.values(this.#exchangeLanguage.requests).map(r => r.id);
                response.messages.push(`Available requests: ${requestNames.join(", ")}`);
            } else { 
                // execute the request
                switch (executionContext.requestDefinition.id) {
                    case "set.get":
                        const setGetOperation = new SetGetOperation(this.#catalogue, this.#exchangeLanguage);
                        setGetOperation.execute(executionContext);
                        break;
                    case "set.list":
                        const setListOperation = new SetListOperation(this.#catalogue, this.#exchangeLanguage);
                        setListOperation.execute(executionContext);
                        break;
                    default:
                        response.messages.push(`Request not implemented: ${executionContext.requestDefinition.id}`);
                }
            }
        } catch (error) {
            response.messages.push(`Error executing request: ${error.message}`);
        } finally { 
            // add instrumentation
            response.metadata.executionDurationMs = performance.now() - request.metadata.executionStartTimeMs;
    
            return response;
        }    
    }
}
