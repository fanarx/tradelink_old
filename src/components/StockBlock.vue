<template>
  <div class="rounded overflow-hidden shadow-lg border border-gray-400 mb-8 flex flex-col">
    <div class="flex justify-between">
      <span :class="{ 'text-gray-900 font-bold p-3': true, 'text-red-600': title.toLowerCase() === 'on focus' }">{{
        title
      }}</span>
      <span class="flex items-center py-2">
        <input
          @keyup.enter="addStock"
          class="appearance-none bg-gray-300 border-none w-full text-gray-700 mr-2 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Stock Name"
          v-model="stockName"
        />
        <span class="flex mr-2" @click="addStock">
          <icon-base class="w-6 h-6 cursor-pointer" icon-name="plus">
            <icon-plus />
          </icon-base>
        </span>
      </span>
    </div>
    <div class="border-t border-gray-400 p-3 flex flex-wrap">
      <span class="mr-2 mb-2 border border-orange-400 cursor-pointer relative" v-for="item in items" :key="item.id">
        <span @click="deleteStock(item.id)">
          <icon-base class="flex-end w-4 h-4 m-1 cursor-pointer absolute right-0 top-0" icon-name="plus">
            <icon-delete />
          </icon-base>
        </span>
        <div class="pr-4 pt-4 pl-2 pb-2 mr-2">{{ item.name }}</div>
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { GET_BOXES } from '../queries';
import IconBase from './IconBase';
import IconPlus from './icons/IconPlus';
import IconDelete from './icons/IconDelete';

const INSERT_STOCKS = gql`
  mutation insert_stocks($name: String!, $trade_box_id: Int!) {
    insert_stocks(objects: { name: $name, trade_box_id: $trade_box_id }) {
      returning {
        __typename
        id
        name
        trade_box_id
      }
    }
  }
`;

const MOVE_TO_DELETE_STOCKS = gql`
  mutation deleteAndInsert($stock_id: Int!, $trade_box_id: Int!) {
    delete_stocks(where: { id: { _eq: $stock_id } }) {
      returning {
        __typename
        id
        trade_box_id
      }
    }
    delete_stocksDelete(where: { stock_id: { _is_null: false } }) {
      affected_rows
    }

    insert_stocksDelete(objects: [{ stock_id: $stock_id, trade_box_id: $trade_box_id }]) {
      affected_rows
    }
  }
`;

export default {
  components: {
    IconBase,
    IconPlus,
    IconDelete
  },
  props: ['title', 'items', 'id'],
  setup({ id }) {
    const stockName = ref('');
    const stockToDeleteId = ref('');

    const { mutate: insertStocks } = useMutation(INSERT_STOCKS, () => ({
      optimisticResponse: {
        insert_stocks: {
          returning: [
            {
              __typename: 'stocks',
              id: Math.round(Math.random() * -1000000),
              name: stockName.value,
              trade_box_id: id
            }
          ],
          __typename: 'stocks_mutation_response'
        }
      },
      update: (cache, mutationData) => {
        const insert_stocks = mutationData.data.insert_stocks;

        const data = cache.readQuery({ query: GET_BOXES });
        const tradeBoxId = insert_stocks.returning[0].trade_box_id;
        const tradeBoxIndex = data.trade_box.findIndex(box => box.id === tradeBoxId);

        data.trade_box[tradeBoxIndex].stocks.push({
          id: insert_stocks.returning[0].id,
          name: insert_stocks.returning[0].name,
          __typename: 'stocks'
        });

        cache.writeQuery({
          query: GET_BOXES,
          data
        });
      }
    }));

    const { mutate: deleteAndInsert } = useMutation(MOVE_TO_DELETE_STOCKS, () => ({
      optimisticResponse: {
        delete_stocks: {
          returning: [
            {
              __typename: 'stocks',
              id: stockToDeleteId.value,
              trade_box_id: id
            }
          ],
          __typename: 'stocks_mutation_response'
        },
        delete_stocksDelete: {
          __typename: 'stocksDelete_mutation_response',
          affected_rows: 1
        },
        insert_stocksDelete: {
          __typename: 'stocksDelete_mutation_response',
          affected_rows: 1
        }
      },
      update: (cache, mutationData) => {
        const deletedStockId = mutationData.data.delete_stocks.returning[0].id;
        const deletedStockTradeBoxId = mutationData.data.delete_stocks.returning[0].trade_box_id;

        const data = cache.readQuery({
          query: GET_BOXES
        });
        const tradeBoxIndex = data.trade_box.findIndex(box => box.id === deletedStockTradeBoxId);

        data.trade_box[tradeBoxIndex].stocks = data.trade_box[tradeBoxIndex].stocks.filter(
          stock => stock.id !== deletedStockId
        );

        cache.writeQuery({
          query: GET_BOXES,
          data
        });
      }
    }));

    function addStock() {
      insertStocks({
        name: stockName.value,
        trade_box_id: id
      });
      stockName.value = '';
    }

    function deleteStock(stock_id) {
      stockToDeleteId.value = stock_id;
      deleteAndInsert({
        stock_id,
        trade_box_id: id
      });
    }

    return {
      stockName,
      addStock,
      deleteStock
    };
  }
};
</script>
