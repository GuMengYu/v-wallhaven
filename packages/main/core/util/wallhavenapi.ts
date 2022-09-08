import axios from 'axios'
export default {
  '/wallhaven/search': async (req, res) => {
    const { query: params } = req
    try {
      const { data } = await axios.get('https://wallhaven.cc/api/v1/search', {
        params,
      })
      res.send(JSON.stringify({ data, code: 200 }))
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
  },
  '/wallhaven/get/:id': async (req, res) => {
    const { params, query } = req
    try {
      const {
        data: { data },
      } = await axios.get(`https://wallhaven.cc/api/v1/w/${params.id}`, {
        params: query,
      })
      res.send(JSON.stringify({ data, code: 200 }))
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
    return axios.get('https://wallhaven.cc/api/v1/search')
  },
}
