<template>
  <div class="hello">
    <h1>Hello World</h1>
  </div>
</template>

<script>
import { onMounted } from "@vue/composition-api";
import gql from "graphql-tag";
import { useApollo } from "../composables/useApollo";

export default {
  name: "HelloWorld",
  setup() {
    const apollo = useApollo();

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
        .then(data => {
          console.log("TCL: mounted -> data from apollo", data);
        });
    });
  }
};
</script>

<style scoped>
</style>
