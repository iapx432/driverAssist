import { CanonicalSpatialReference } from '../canonical/spatial-reference.js';
import { Point } from '../canonical/point.js';
import { PolyLine } from '../canonical/polyLine.js';

import { MapTilerProviderId } from '../../acquisition/providers/maptiler/maptiler.js';

/**
 * @al_entityType Transformer
 * @al_transformsFrom ProviderSpatialReference
 * @al_transformsTo CanonicalSpatialReference
 */
export class ProviderSpatialReferenceToCanonicalTransformer {

    transform(providerSpatialReference) {

        const canonicalSpatialReference = new CanonicalSpatialReference();

        canonicalSpatialReference.providerSpatialReference = providerSpatialReference;

        // Multiple providers can be supported.
        // As provider-specific transformations diverge, this transformer may
        // delegate to provider-specific implementations.

        switch (providerSpatialReference.source) {
            case MapTilerProviderId:
                if (providerSpatialReference.representation.point) {
                    // transform the MapTiler point to a canonical point: toCanonicalPoint(providerPoint)
                    const point = new Point();
                    point.latitude = providerSpatialReference.representation.point.y;
                    point.longitude = providerSpatialReference.representation.point.x;
                    canonicalSpatialReference.items.push(point);
                } else if (providerSpatialReference.representation.parts) {
                    // transform the MapTiler polyline to a canonical polyline: toCanonicalPolyLine(providerPolyLine)
                    for (const mapTilerPolyLine of providerSpatialReference.representation.parts) {
                        const polyLine = new PolyLine();
                        for (const mapTilerPoint of mapTilerPolyLine) {
                            const point = new Point();
                            point.latitude = mapTilerPoint.y;
                            point.longitude = mapTilerPoint.x;
                            polyLine.points.push(point);
                        }
                        canonicalSpatialReference.items.push(polyLine);
                    }
                } else {
                    console.warn(`ProviderSpatialReferenceToCanonicalTransformer: Unknown representation for provider ${providerSpatialReference.source}:`, providerSpatialReference.representation);
                }
        }

        return canonicalSpatialReference;
    }
}