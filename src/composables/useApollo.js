import { provide, inject } from '@vue/composition-api';

const ApolloSymbol = Symbol();

export function provideApollo(apollo) {
  provide(ApolloSymbol, apollo);
}

export function useApollo() {
  const apollo = inject(ApolloSymbol);

  if (!apollo) {
    console.error('no apollo');
  }

  return apollo;
}
