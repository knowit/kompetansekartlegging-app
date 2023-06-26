import { SqlParameter } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../utils/sql'
import { IQuestionAnswer } from '../../utils/types'
import { IUsername } from './types'

const unlinkUserFromQuestionAnswer = async ({ username }: IUsername) => {
  const anonId = `anynomous-${uuidv4()}`

  const parameters: SqlParameter[] = [
    {
      name: 'username',
      value: { stringValue: username },
    },
    {
      name: 'anonId',
      value: { stringValue: anonId },
    },
  ]

  const query = `UPDATE question_answer
  SET username=:anonId
  WHERE username=:username
  RETURNING *`
  return await sqlQuery<IQuestionAnswer[]>({
    message: `🚀 ~ > ${username}'s question answers anonymized.`,
    query,
    parameters,
    isArray: true,
  })
}

export default { unlinkUserFromQuestionAnswer }
