import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'

type Kinds = 'string' | 'int' | 'uuid' | 'timestamp'
type Field = {
  kind: Kinds
}

type Table = Record<string, Field>

export const formDefinitionColumns: Table = {
  id: { kind: 'uuid' },
  createdAt: { kind: 'timestamp' },
  updatedAt: { kind: 'timestamp' },
  organizationId: { kind: 'string' },
  label: { kind: 'string' },
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
  }
}
