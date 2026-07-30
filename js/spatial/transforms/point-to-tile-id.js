import { TileId } from "../../acquisition/tiles/tile-id.js";

// transforms a canonical point to a tile id based on a specific policy (e.g. zoom level, tile size, etc.)

/**
 * @dal_entityType Transformer
 * @dal_transformsFrom Point
 * @dal_transformsTo TileId
 */

export class PointToTileIdTransformer {

    from = "Point";
    to = "TileId";

    transform(canonicalPoint, policy) {

        const tileId = new TileId();

        // TODO

        return tileId;
    }
}