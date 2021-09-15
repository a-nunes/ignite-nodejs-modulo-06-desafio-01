import { APIGatewayProxyResult } from 'aws-lambda';

export const returnError = (errorMessage: string, statusCode = 400): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify({
      error: errorMessage,
    }),
    headers: {
      "Content-Type": "application/json",
    }
  }
}