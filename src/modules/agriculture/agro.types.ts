export interface GetPolygonParams {
  polygonId: string;
}

export interface CoordParams {
    lat?: number;
    lon?: number;
    polyid?: string;
}

export interface UviForecastParams extends CoordParams {
    cnt?: number;
}

export interface UviHistoryParams extends CoordParams {
    start: number;
    end: number;
}

export interface AccumulatedTempParams {
    polyid: string;
    start: number;
    end: number;
    threshold?: number;
}

export interface AccumulatedPrecipitationParams {
    polyid: string;
    start: number;
    end: number;
}

export interface NdviHistoryParams {
    polyid: string;
    start: number;
    end: number;
}