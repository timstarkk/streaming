/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelcommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      message
      owner
      createdAt
      updatedAt
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelcommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      message
      owner
      createdAt
      updatedAt
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelcommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      message
      owner
      createdAt
      updatedAt
    }
  }
`;
