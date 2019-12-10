import gql from 'graphql-tag';

export const GET_USERS = gql`
  query getUsers {
    user {
      id
      name
      is_confirmed
    }
  }
`;
