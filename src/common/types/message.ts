interface DbCreatePayload {
    op: "c";
    row: unknown;
}
interface DbUpdatePayload {
    op: "u";
    rows: unknown[];
}
interface DbDeletePayload {
    op: "d";
    ids: number[];
}
interface DbChangeMessage {
    type: "db-change";
    table: string;
    data: DbCreatePayload | DbUpdatePayload | DbDeletePayload;
}
export type Message = DbChangeMessage;
