const express = require ('express')
const {MongoClient} = require('mongodb')
const uri = 'mongodb://127.0.0.1:27017/'
const cors = require('cors')

const PORT = process.env.PORT || 8000

const app = express()

app.use(express.json({extended: false}))
app.use(cors())

// const client = new MongoClient(uri)
// const dbname = 'mern-blog'
// const collection_name = 'articles'
// const articlesCollection = client.db(dbname).collection(collection_name) 

const connectToDatabase = async () => {
    try{
        await client.connect()
        console.log(`Connected to the ${dbname} database`)
    }
    catch(error){
        console.error(error)
    }
}

const mainDB = async () => {
    try {
        await connectToDatabase()
        
    } catch (error) {
        console.error(error)        
    }
}

const wtihDB = async (operations, res) => {
    try {
        const client = new MongoClient(uri)
        const dbname = 'mern-blog'
        const db = client.db(dbname)
        await operations(db)        
        client.close()        
    } catch (error) {
        res.status(500).json({message: "Error connecting to database", error})
    }
}

app.get('/', async (req, res) => {
    res.json({'msg':'Server is running'})    
})


app.get('/api/articles', async (req, res) => {
        wtihDB(async (db) => {
            const collection_name = 'articles'
            const articlesInfo = await  db.collection(collection_name).find({}).toArray()
            res.status(200).json({"articles":articlesInfo})    
        }, res)
    
})

app.get('/api/articles/:name', async (req, res) => {
    wtihDB(async (db) => {
        const articleName = req.params.name
        const collection_name = 'articles'
        const articleInfo = await  db.collection(collection_name).findOne({name: articleName})        
        if (articleInfo == null) {
            return res.status(404).json({msg:`'${articleName}' article not found`})
        }
        res.status(200).json({articleInfo})
    },res)
})

app.post('/api/articles/:name/add-comments',(req, res) => {
    const {username, text } = req.body
    const articleName = req.params.name
    wtihDB(async (db) => {
        const articleName = req.params.name
        const collection_name = 'articles'
        const articleInfo = await  db.collection(collection_name).findOne({name: articleName})
        await db.collection(collection_name).updateOne({name:articleName},{
            $set:{
                comments:articleInfo.comments.concat({username, text})
            }
        })

        const updatedArticleInfo = await  db.collection(collection_name).findOne({name: articleName})

        res.status(200).json({article_info:updatedArticleInfo})
    }, res)

})


app.listen(PORT, () => {
    // mainDB()
    console.log(`Server is running at port ${PORT}`)
})