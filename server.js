const express = require ('express')
const PORT = process.env.PORT || 8000

const app = express()

app.get('/',(req, res) => {
    res.json({'msg':'Server is running'})
})

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))