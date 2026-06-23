import {
    InferenceNode
}
from './inference-node.js';

import {
    getEvidenceByType,
    getEvidenceBySource
}
from '../route/evidence.js';

export class SteepRoadInferenceNode
extends InferenceNode {

    constructor() {

        super();

        this.name =
            'SteepRoadInferenceNode';
    }

    evaluate(
        route
    ) {
        const steepnessEvidence =

            getEvidenceByType(
                route,
                'steepness'
            );

        const interestingEvidence =
            steepnessEvidence.filter(
                evidence =>
                    Math.abs(evidence.category) >= 4
            );

        interestingEvidence.forEach(
            evidence => {
                route.acquisitionRequests.push(
                    {
                        type:
                            'environment.map.road.features',
                        startM:
                            evidence.startM,
                        endM:
                            evidence.endM,
                        reason:
                            `steepnessCategory: ${evidence.category}`
                    }
                );
            }
        );
    }
}