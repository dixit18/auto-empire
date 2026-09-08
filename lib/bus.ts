import { Either, Schema } from "effect";

/* Typed boundary for everything the agents write.
   Before: one malformed bus line or POST body could poison a whole response.
   Now: decode-then-act — bad lines are counted, never trusted. */

export const BusStatus = Schema.Literal("started", "progress", "done", "needs-approval", "blocked");
export type BusStatus = Schema.Schema.Type<typeof BusStatus>;

export const BusRecord = Schema.Struct({
  ts: Schema.String,
  team: Schema.String,
  from: Schema.String,
  to: Schema.String,
  phase: Schema.String,
  msg: Schema.String,
  status: BusStatus,
});
export type BusRecord = Schema.Schema.Type<typeof BusRecord>;

export function parseBusLine(line: string): BusRecord | null {
  try {
    return Either.getOrNull(Schema.decodeUnknownEither(BusRecord)(JSON.parse(line)));
  } catch {
    return null;
  }
}

export const AdvanceBody = Schema.Struct({
  teamId: Schema.optional(Schema.String),
  autoAll: Schema.optional(Schema.Boolean),
});
export type AdvanceBody = Schema.Schema.Type<typeof AdvanceBody>;

export function parseAdvanceBody(u: unknown): AdvanceBody {
  return Either.getOrElse(Schema.decodeUnknownEither(AdvanceBody)(u), () => ({}));
}
