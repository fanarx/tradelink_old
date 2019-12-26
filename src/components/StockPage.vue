<template>
  <main class="w-full flex flex-col items-center p-6">
    <div class="max-w-sm w-3/4" v-for="stockGroup in tradeBox" :key="stockGroup.id">
      <stock-block :id="stockGroup.id" :title="stockGroup.title" :items="stockGroup.stocks" />
    </div>
  </main>
</template>

<script>
import gql from 'graphql-tag';
import StockBlock from './StockBlock';
import { useQuery, useResult } from '@vue/apollo-composable';

const GET_BOXES = gql`
  query getBoxes {
    trade_box {
      id
      title
      stocks {
        id
        name
      }
    }
  }
`;
const SUBSCRIBE_STOCKS = gql`
  subscription {
    stocks(order_by: { created_at: desc }, limit: 1) {
      id
      name
      trade_box {
        id
        title
      }
    }
  }
`;

export default {
  components: {
    StockBlock
  },
  setup() {
    const { result, subscribeToMore } = useQuery(GET_BOXES);

    const tradeBox = useResult(result, []);

    subscribeToMore(() => ({
      document: SUBSCRIBE_STOCKS,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (subscriptionData.data.stocks.length > 0) {
          const titleIndex = previousResult.trade_box.findIndex(
            box => box.id === subscriptionData.data.stocks[0].trade_box.id
          );

          const isStockInBox =
            previousResult.trade_box[titleIndex].stocks.findIndex(
              stock => stock.id === subscriptionData.data.stocks[0].id
            ) >= 0;

          if (!isStockInBox) {
            previousResult.trade_box[titleIndex].stocks.push({
              id: subscriptionData.data.stocks[0].id,
              name: subscriptionData.data.stocks[0].name,
              __typename: 'stocks'
            });
          }
          return previousResult;
        }
      }
    }));

    return {
      tradeBox
    };
  }
};
</script>

<style scoped></style>
