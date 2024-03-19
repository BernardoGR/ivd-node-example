const express = require('express')
const {getUserById, getUserGroups} = require('./adminApiClient')

const app = express()
const port = 3000

app.get('/v1/users/find_one/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id)
    res.send(user)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching user')
  }
})

app.get(
  '/v1/school_cycles/user_groups_index/:cycle_id/:user_ivd_id',
  async (req, res) => {
    try {
      const userGroups = await getUserGroups(
        req.params.cycle_id,
        req.params.user_ivd_id,
      )
      res.send(userGroups)
    } catch (error) {
      console.error(error)
      res.status(500).send('Error fetching user')
    }
  },
)

app.listen(port, () => {
  console.log('Server is running on port 3000')
})
