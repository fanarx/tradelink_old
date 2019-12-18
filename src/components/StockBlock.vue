<template>
  <div class="rounded overflow-hidden shadow-lg border border-gray-400 mb-8 flex flex-col">
    <div class="flex justify-between">
      <span class="text-gray-900 font-bold p-3">{{ title }}</span>
      <span class="flex items-center py-2">
        <input
          class="appearance-none bg-gray-200 border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Stock Name"
        />
      </span>
    </div>
    <div class="border-t border-gray-400 p-3 flex flex-wrap">
      <span
        class="p-2 mr-2 mb-2 border border-orange-400 cursor-pointer"
        v-for="item in items"
        :key="item.id"
      >
        {{ item.name }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "items"]
};
</script>