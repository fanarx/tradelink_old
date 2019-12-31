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

export const GET_BOXES = gql`
  query getBoxes {
    trade_box {
      id
      title
      stocks(order_by: { created_at: asc }) {
        id
        name
      }
    }
  }
`;
