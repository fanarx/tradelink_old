<template>
  <div class="hello">
    <h1>Hello Trading</h1>
    <ul>
      <li
        v-for="stock in tradeBox.allStocks"
        :key="stock.id"
      >
        {{stock.title}}
        <ul>
          <li
            v-for="item in stock.stocks"
            :key="item.id"
          >
            {{item.name}}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { onMounted, reactive } from "@vue/composition-api";
import gql from "graphql-tag";
import { useApollo } from "../composables/useApollo";

export default {
  name: "HelloWorld",
  setup() {
    const apollo = useApollo();

    const tradeBox = reactive({
      allStocks: {
        title: "",
        stocks: []
      }
    });

    onMounted(() => {
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
      apollo
        .query({
          query: GET_BOXES
        })
        .then(({ data }) => {
          tradeBox.allStocks = data.trade_box;
        });
    });

    return { tradeBox };
  }
};
</script>

<style scoped>
</style>
