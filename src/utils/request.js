export default (apiPath, options) => {
  return fetch(process.env.VUE_APP_API_URL + '/' + apiPath, options)
}
