import { useEffect, useState } from 'react'
import personService from '../services/persons.jsx'
import Notification from './notification.jsx'

const Filter=({filter, handleFilterChange})=>{
  return(
    <div>
        filter shown with<input value={filter} onChange={handleFilterChange}/>
      </div>
  )
}

const PersonForm=({addPerson, newName, handleNameChange, newNumber, handleNumberChange})=>{
  return(
    <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons=({personsEsilla, deletePerson})=>{
  return(
    <ul>
        {personsEsilla.map(person=>
          <li key={person.name}>{person.name} {person.number}
            <button onClick={()=>deletePerson(person.id)}>delete</button>
            </li>
        )}
      </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const[newNumber, setNewNumber]=useState('')
  const[filter, setFilter]=useState('')
  const [notificationMessage, setNotificationMessage]=useState({state: null, color: 'green'})

  


  useEffect(()=>{
    console.log('effect')
    personService.getAll().then(initialPersons=>{
      setPersons(initialPersons)
    })
    
      
  },[])

  const addPerson=(event)=>{
    event.preventDefault()

    const alreadyPerson=persons.find(person=>person.name===newName)

    if(alreadyPerson){
      const confirmUpdate=window.confirm(newName+' is already')
      if(confirmUpdate){
        const updatedPerson={...alreadyPerson, number: newNumber}
        personService.update(alreadyPerson.id, updatedPerson).then(returnedPerson=>{
          setPersons(persons.map(person=>person.id !== alreadyPerson.id ? person : returnedPerson))
          setNewNumber('')
          setNotificationMessage({state:`Updated number for ${newName}`, color:'green'})
          setTimeout(()=>{
            setNotificationMessage({state:null, color:'green'})
          }, 5000)

          
        }).catch(error=>{
          setNotificationMessage({state:`Information of ${newName} has already been removed from the server`,color: 'red'})
          setTimeout(()=>{
            setNotificationMessage({state:null, color:'green'})
          },5000)
          setPersons(persons.filter(p=>p.id!==alreadyPerson.id))
        })
    }
    
    }else{
      const newPerson={
        name:newName,
        number:newNumber
      }

      personService.create(newPerson).then(returnedPerson=>{
        setPersons(persons.concat(returnedPerson))
        
        setNewName('')
        setNewNumber('')
        setNotificationMessage({state:`Added ${newName}`, color:'green'})
          
          setTimeout(()=>{
            setNotificationMessage({state:null, color:'green'})
          },5000)
      }).catch(error=>{
        setNotificationMessage({state:`Error: adding error ${newName}`, color: 'red'})
        setTimeout(()=>{
          setNotificationMessage({state:null, color:'green'})
        },5000)

      })
    }
  }

  const deletePerson=(id)=>{
    const person=persons.find(p=>p.id===id)
    if(window.confirm('Delete '+person.name)){
      personService.remove(id).then(()=>{
        setPersons(persons.filter(p=>p.id!==id))
        setNotificationMessage({state:`Deleted ${person.name}`, color:'green'})
          setTimeout(()=>{
            setNotificationMessage({state: null, color:'green'})
          },5000)
      }).catch(error=>{
        setNotificationMessage({state:`Error: delete error ${newName}`, color: 'red'})
        setTimeout(()=>{
          setNotificationMessage({state:null, color:'green'})
        },5000)
      })
    }
  }

  const handleNameChange=(event)=>{
    setNewName(event.target.value)
  }

  const handleNumberChange=(event)=>{
    setNewNumber(event.target.value)
  }

  const handleFilterChange=(event)=>{
    setFilter(event.target.value)
  }
const personsEsilla=filter
  ? persons.filter(person=>person.name.toLowerCase().includes(filter.toLowerCase()))
  :persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      
      <h2>add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        />

      <h2>Numbers</h2>
      <Persons personsEsilla={personsEsilla} deletePerson={deletePerson}/>
      
    </div>
  )

}

export default App