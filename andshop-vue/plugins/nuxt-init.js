export default function ({ app, store }) {
  // app context'ini store'a aktar
  store.commit('SET_APP', app);
} 