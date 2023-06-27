import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'

type Kinds = 'string' | 'int' | 'uuid' | 'timestamp' | 'boolean'
type Field = {
  kind: Kinds
}

type Table = Record<string, Field>

export const catalogColumns: Table = {
  id: { kind: 'uuid' },
  label: { kind: 'string' },
  created_at: { kind: 'timestamp' },
  updated_at: { kind: 'timestamp' },
  active: { kind: 'boolean' },
}

export function kindToParam(paramValue: any, kind: Kinds): SqlParameter {
  switch (kind) {
    case 'string':
      return { value: { stringValue: paramValue } }
    case 'int':
      return { value: { longValue: paramValue } }
    case 'uuid':
      return { value: { stringValue: paramValue }, typeHint: TypeHint.UUID }
    case 'timestamp':
      return {
        value: { stringValue: paramValue },
        typeHint: TypeHint.TIMESTAMP,
      }
    case 'boolean':
      return { value: { booleanValue: paramValue } }
  }
}
