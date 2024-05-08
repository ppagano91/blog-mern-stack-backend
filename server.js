const express = require ('express')
const {MongoClient} = require('mongodb')
const uri = 'mongodb://127.0.0.1:27017/'

const PORT = process.env.PORT || 8000

const app = express()

const client = new MongoClient(uri)
const dbname = 'mern-blog'
const collection_name = 'articles'
const articlesCollection = client.db(dbname).collection(collection_name) 

const connectToDatabase = async () => {
    try{
        await client.connect()
        console.log(`Connected to the ${dbname} database`)
    }
    catch(error){
        console.error(error)
    }
}

const main = async () => {
    try {
        await connectToDatabase()
        
    } catch (error) {
        console.error(error)        
    }
}



app.use(express.json({extended: false}))

app.get('/', async (req, res) => {
    res.json({'msg':'Server is running'})    
})


app.get('/api/articles', async (req, res) => {
    try{
        const articlesInfo = await articlesCollection.find({}).toArray()
        res.status(200).json({"articles":articlesInfo})
    }
    catch(error){
        console.log(error)
        res.status(500).json({messge:error})
    }
    
})

app.get('/api/articles/:name', async (req, res) => {
    try{
        const articleName = req.params.name
        const articleInfo = await articlesCollection.findOne({name: articleName})
        if (articleInfo == null) {
            return res.status(404).json({msg:`'${articleName}' article not found`})
        }
        res.status(200).json({articleInfo})
    }
    catch (error){
        console.error(error)
        res.status(500).json({error: true, msg: error})
    }
})

app.post('/api/articles/:name/add-comments',(req, res) => {
    const {username, text } = req.body
    const articleName = req.params.name
    articlesInfo[articleName].comments.push({username, text})
    res.status(200).send(articlesInfo[articleName])
})


app.listen(PORT, () => {
    main()
    console.log(`Server is running at port ${PORT}`)
})