<template>
  <div class="rounded overflow-hidden shadow-lg border border-gray-400 mb-8 flex flex-col">
    <div class="flex justify-between">
      <span class="text-gray-900 font-bold p-3">{{ title }}</span>
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
      <span class="p-2 mr-2 mb-2 border border-orange-400 cursor-pointer" v-for="item in items" :key="item.id">
        {{ item.name }}
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import IconBase from './IconBase';
import IconPlus from './icons/IconPlus';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

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

export default {
  components: {
    IconBase,
    IconPlus
  },
  props: ['title', 'items', 'id'],
  setup({ id }) {
    const stockName = ref('');
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
        const insert_stocks = mutationData.data.insert_stocks;

        const data = cache.readQuery({ query: GET_BOXES });
        const tradeBoxId = insert_stocks.returning[0].trade_box_id;
        const titleIndex = data.trade_box.findIndex(box => box.id === tradeBoxId);

        data.trade_box[titleIndex].stocks.push({
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
    function addStock() {
      insertStocks({
        name: stockName.value,
        trade_box_id: id
      });
      stockName.value = '';
    }

    return {
      stockName,
      addStock
    };
  }
};
</script>
