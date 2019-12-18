<template>
  <main class="w-full flex flex-col items-center p-6">
    <div
      class="max-w-sm w-3/4"
      v-for="stockGroup in tradeBox"
      :key="stockGroup.id"
    >
      <stock-block
        :title="stockGroup.title"
        :items="stockGroup.stocks"
      />
    </div>
  </main>
</template>

<script>
import gql from "graphql-tag";
import { useQuery, useResult } from "@vue/apollo-composable";
import StockBlock from "./StockBlock";

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
  components: {
    StockBlock
  },
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
