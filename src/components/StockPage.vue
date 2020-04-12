<template>
  <main class="w-full flex justify-around pt-16 flex-wrap">
    <div class="max-w-sm w-3/4" v-for="stockGroup in tradeBox" :key="stockGroup.id">
      <stock-block :id="stockGroup.id" :title="stockGroup.title" :items="stockGroup.stocks" />
    </div>
  </main>
</template>

<script>
import gql from 'graphql-tag';
import StockBlock from './StockBlock';
import { useQuery, useResult } from '@vue/apollo-composable';
import { GET_BOXES } from '../queries';

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

const SUBSCRIBE_DELETED_STOCKS = gql`
  subscription {
    stocksDelete {
      stock_id
      trade_box_id
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
          const tradeBoxIndex = previousResult.trade_box.findIndex(
            box => box.id === subscriptionData.data.stocks[0].trade_box.id
          );

          const isStockInBox =
            previousResult.trade_box[tradeBoxIndex].stocks.findIndex(
              stock => stock.id === subscriptionData.data.stocks[0].id
            ) >= 0;

          if (!isStockInBox) {
            previousResult.trade_box[tradeBoxIndex].stocks.push({
              id: subscriptionData.data.stocks[0].id,
              name: subscriptionData.data.stocks[0].name,
              __typename: 'stocks'
            });
          }
          return previousResult;
        }
      }
    }));

    subscribeToMore(() => ({
      document: SUBSCRIBE_DELETED_STOCKS,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (subscriptionData.data.stocksDelete && subscriptionData.data.stocksDelete.length > 0) {
          const stockId = subscriptionData.data.stocksDelete[0].stock_id;
          const tradeBoxId = subscriptionData.data.stocksDelete[0].trade_box_id;

          const tradeBoxIndex = previousResult.trade_box.findIndex(box => box.id === tradeBoxId);

          previousResult.trade_box[tradeBoxIndex].stocks = previousResult.trade_box[tradeBoxIndex].stocks.filter(
            stock => stock.id !== stockId
          );
        }
        return previousResult;
      }
    }));

    return {
      tradeBox
    };
  }
};
</script>

<style scoped></style>
