<template>
  <main class="w-full flex flex-col items-center p-6">
    <div
      class="max-w-sm rounded overflow-hidden shadow-lg border border-gray-400 mb-8 w-3/4 flex flex-col"
      v-for="stockGroup in tradeBox"
      :key="stockGroup.id"
    >
      <span class="text-gray-900 font-bold p-3">{{ stockGroup.title }}</span>
      <div class="border-t border-gray-400 p-3 flex flex-wrap">
        <span
          class="p-2 mr-2 mb-2 border border-orange-400 cursor-pointer"
          v-for="item in stockGroup.stocks"
          :key="item.id"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
  </main>
</template>

<script>
import gql from 'graphql-tag';
import { useQuery, useResult } from '@vue/apollo-composable';

const GET_BOXES = gql`
  query getBoxes {
    trade_box {
      title
      stocks {
        name
      }
    }
  }
`;

export default {
  setup() {
    const { result } = useQuery(GET_BOXES);

    const tradeBox = useResult(result, []);

    return {
      tradeBox
    };
  }
};
</script>

<style scoped></style>
