
declare module 'mapbox-gl' {
  export type EventData = any;
  export type MapMouseEvent = any;
  
  export class Map {
    constructor(options: any);
    addControl(control: any, position?: string): void;
    on(event: string, listener: any): void;
    off(event: string, listener: any): void;
    remove(): void;
    getCanvas(): HTMLCanvasElement;
    getCenter(): LngLat;
    getZoom(): number;
    flyTo(options: any): void;
    easeTo(options: any): void;
    fitBounds(bounds: LngLatBounds, options?: any): void;
    addSource(id: string, source: any): void;
    getSource(id: string): GeoJSONSource | any;
    addLayer(layer: any): void;
    scrollZoom: { enable(): void; disable(): void };
    setFog(fog: any): void;
  }
  
  export class Marker {
    constructor(element?: HTMLElement);
    setLngLat(lngLat: [number, number] | LngLat): this;
    addTo(map: Map): this;
    remove(): this;
    setPopup(popup: Popup): this;
    getPopup(): Popup | null;
    getElement(): HTMLElement;
  }
  
  export class Popup {
    constructor(options?: any);
    setLngLat(lngLat: [number, number] | LngLat): this;
    setHTML(html: string): this;
    setText(text: string): this;
    addTo(map: Map): this;
    remove(): this;
  }
  
  export class NavigationControl {
    constructor(options?: any);
  }
  
  export class LngLat {
    lng: number;
    lat: number;
    constructor(lng: number, lat: number);
    wrap(): LngLat;
    toArray(): [number, number];
    toString(): string;
    distanceTo(lngLat: LngLat): number;
    toBounds(radius: number): LngLatBounds;
  }
  
  export class LngLatBounds {
    constructor(sw?: [number, number] | LngLat, ne?: [number, number] | LngLat);
    extend(lngLat: [number, number] | LngLat | LngLatBounds): this;
    getCenter(): LngLat;
    getSouthWest(): LngLat;
    getNorthEast(): LngLat;
    getNorth(): number;
    getSouth(): number;
    getWest(): number;
    getEast(): number;
    isEmpty(): boolean;
    toArray(): [[number, number], [number, number]];
    toString(): string;
    contains(lngLat: [number, number] | LngLat): boolean;
  }
  
  export class GeoJSONSource {
    setData(data: any): void;
  }
  
  export let accessToken: string;
}
