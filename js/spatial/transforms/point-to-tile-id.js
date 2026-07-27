import { TileId } from "../../acquisition/tiles/tile-id.js";

export class PointToTileId {

    from = "Point";

    to = "TileId";

    transform(point, policy) {

        const tileId = new TileId();

        // TODO

        return tileId;
    }
}