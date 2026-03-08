import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';

export type LedgerCursor = {
  createdAt: string; // ISO string
  id: string;
};

const CURSOR_SEP = '|';

export function parseLedgerCursorOrThrow(
  cursor?: string,
): LedgerCursor | undefined {
  if (!cursor) return undefined;

  const sep = cursor.indexOf(CURSOR_SEP);
  if (sep <= 0 || sep === cursor.length - 1) {
    throw new AppException(
      { code: ERROR_CODES.INVALID_CURSOR, message: 'Invalid cursor format' },
      HttpStatus.BAD_REQUEST,
    );
  }

  const createdAtRaw = cursor.slice(0, sep).trim();
  const id = cursor.slice(sep + 1).trim();

  if (!createdAtRaw || !id) {
    throw new AppException(
      { code: ERROR_CODES.INVALID_CURSOR, message: 'Invalid cursor value' },
      HttpStatus.BAD_REQUEST,
    );
  }

  const d = new Date(createdAtRaw);
  if (Number.isNaN(d.getTime())) {
    throw new AppException(
      { code: ERROR_CODES.INVALID_CURSOR, message: 'Invalid cursor datetime' },
      HttpStatus.BAD_REQUEST,
    );
  }

  // Canonicalize createdAt to ensure cursor stability (avoiding inconsistent date formats)
  return { createdAt: d.toISOString(), id };
}

export function stringifyLedgerCursor(c: LedgerCursor): string {
  // Maintain canonical form: createdAt is always stored as ISO string
  const createdAt = new Date(c.createdAt).toISOString();
  return `${createdAt}${CURSOR_SEP}${c.id}`;
}
