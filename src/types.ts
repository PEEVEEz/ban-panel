
export interface IServer {
    id: number;
    owner: string;
    name: string;
    api_key: string;
    verified: boolean;
}

export interface IBan {
    id: number;
    name: string;
    reason: string;
    server: string;
    identifiers: any;
    expires: string;
    serverId: number
}
export interface IBanData {
    server?: IServer;
    name: string;
    reason: string;
    identifiers: any;
}