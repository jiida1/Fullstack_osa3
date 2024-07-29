const express=require('express')
const morgan=require('morgan')
const cors=require('cors')
const app=express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req)=>JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content.length] - :response-time ms :body'))

let persons=[
    
    { 
        id:1,
        name: 'Arto Hellas',
        number: '040-123456' 
    },
    { 
        id:2,
        name: 'Ada Lovelace', 
        number: '39-44-5323523' 
    },
    { 
        id:3,
        name: 'Dan Abramov', 
        number: '12-43-234345' 
    },
    { 
        id:4,
        name: 'Mary Poppendieck', 
        number: '39-23-6423122' 
    }
    
]

app.get('/api/persons',(request, response)=>{
    response.json(persons)
})

app.get('/info',(request, response)=>{
    const personCount=persons.length
    const currentTime=new Date()

    const info=`
    <p>Phonebook has info for ${personCount}${personCount===1?' person':' people'}</p>
    <p>${currentTime}</p>
    `
    response.send(info)
})

app.get('/api/persons/:id', (request, response)=>{
    const id= Number(request.params.id);
    const person=persons.find(person=>person.id===id)
    if(person){
        response.json(person)
    }else{
        return response.status(400).json({ 
            error: 'content missing' 
            })
          }
    
})

app.delete('/api/persons/:id', (request, response)=>{
    const id=Number(request.params.id)
    const personIndex=persons.findIndex(person=>person.id===id)
    persons=persons.filter(person=>person.id!==id)
    response.status(204).end()
})

const generateId=()=>{
    return Math.floor(Math.random()*1000000)
}

app.post('/api/persons',(request, response)=>{
    const body=request.body


    if(!body.name||!body.number){
        return response.status(400).json({
            error:'Name or number is missing'
        })

    }
    if(persons.find(person=>person.name===body.name)){
        return response.status(400).json({
            error:'Name must be unique'
        })
    }
    const person={
        id: generateId(),
        name:body.name,
        number:body.number,
    }
    persons=persons.concat(person);
    response.json(person)
})

const PORT=process.env.PORT||3001
app.listen(PORT, ()=>{
    console.log('Server running')
})