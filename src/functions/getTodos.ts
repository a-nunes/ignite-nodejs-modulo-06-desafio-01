import { APIGatewayProxyHandler } from 'aws-lambda';
import { validate } from 'uuid';

import { returnError } from 'src/utils/returnError';
import { document } from '../utils/dynamodbClient';

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters;
  if (!validate(userId)) {
    return returnError('User ID must be a valid uuid');
  }

  const response = await document.query({
    TableName: 'todos',
    IndexName: 'TodoByUserId',
    KeyConditionExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": userId,
    },
  }).promise();

  const todos = response.Items;

  return {
    statusCode: 200,
    body: JSON.stringify(todos),
    headers: {
      "Content-Type": "application/json",
    }
  }
}