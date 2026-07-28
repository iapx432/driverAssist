import { TileId } from "../../acquisition/tiles/tile-id.js";

export class PointToTileIdTransformer {

    from = "Point";

    to = "TileId";

    transform(point, policy) {

        const tileId = new TileId();

        // TODO

        return tileId;
    }
}