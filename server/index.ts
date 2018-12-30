import * as express from 'express'
import * as path from 'path'
const app = express()
app.use(express.static(path.join(__dirname,'../dist')))
app.listen(3000)
