import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidV4, validate } from 'uuid'
import { returnError } from 'src/utils/returnError';
import { document } from '../utils/dynamodbClient';


interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters;
  if (!validate(userId)) {
    return returnError('User ID must be a valid uuid');
  }

  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  if (!title) {
    return returnError('Title must be provided');
  }
  if (!deadline) {
    return returnError('Deadline must be provided');
  }

  const id = uuidV4();
  const todo = {
    id, 
    user_id: userId,
    title,
    done: false,
    deadline: (new Date(deadline)).toISOString(),
  }

  await document.put({
    TableName: 'todos',
    Item: todo,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json",
    }
  }
}