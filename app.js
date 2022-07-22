const express=require('express');
const {ObjectId}=require('mongodb')
const {getDb,connectToDb}=require('./db.js')
const app=express();
app.use(express.json())
//db connection
let db;
connectToDb((err)=>{
  if(!err){
    app.listen(5000,(req,res)=>{
        console.log('listening on port 5000')
    })
    db=getDb()
  }
})
app.get('/books',(req,res)=>{
  const page=req.query.p||0;
  const bookPerPage=3;
  let books=[]
  db.collection('books').find().skip(page * bookPerPage).limit(bookPerPage).sort({author:1}).forEach((book) => {
  books.push(book)
}).then(()=>{
  res.status(200).json(books)
}).catch(()=>{
  res.status(500).json({error:'could not fetch the documents'})
})
})
app.get('/books/:id',(req,res)=>{
  if(ObjectId.isValid(req.params.id)){
    db.collection('books').findOne({_id:ObjectId(req.params.id)}).then((doc)=>{
      res.status(200).json(doc)
    }).catch((err)=>{
      res.status(500).json({error:'could not fetch the document'})
    })
  }else{
    res.status(500).json({error:'not a valid id'})
  }
})
app.post('/books',(req,res)=>{
  let book=req.body
  db.collection('books').insertOne(book).then((results)=>{
    res.status(201).json(results)
  }).catch((err)=>{
    res.status(500).json({error:'could not create the new document'});
  })
})
app.delete('/books/:id',(req,res)=>{
  if(ObjectId.isValid(req.params.id)){
    db.collection('books').deleteOne({_id:ObjectId(req.params.id)}).then((results)=>{
      res.status(200).json(results)
    }).catch((err)=>{
      res.status(500).json({error:'could not delete the document'})
    })
  }else{
    res.status(500).json({error:'not a valid id'})
  }
})
app.patch('/books/:id',(req,res)=>{
  const updates=req.body;
  if(ObjectId.isValid(req.params.id)){
    db.collection('books').updateOne({_id:ObjectId(req.params.id)},{$set:updates}).then((results)=>{
      res.status(200).json(results)
    }).catch((err)=>{
      res.status(500).json({error:'could not update the document'})
    })
  }else{
    res.status(500).json({error:'not a valid id'})
  }
})