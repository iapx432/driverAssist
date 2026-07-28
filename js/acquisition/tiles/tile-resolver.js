import { PointToTileIdTransformer } from '../../spatial/transforms/point-to-tile-id.js';

export class TileResolver {

    #pointToTileIdTransformer = null;

    constructor() {
        this.#pointToTileIdTransformer = new PointToTileIdTransformer();
    }

    resolve(spatialReference, policy) {

        if (spatialReference.representation.point) {
            return [
                this.#pointToTileIdTransformer.transform(
                    spatialReference.representation.point,
                    policy)
            ];
        }

        return [];
    }
}
