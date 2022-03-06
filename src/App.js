import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';

const URL = 'http://localhost/shopping-list-back/';

function App() {
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      });
  }, []);

  function save(e) {
    e.preventDefault();

    const json = JSON.stringify({description:item,amount:amount});
    
    axios.post(URL + 'add.php', json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      setItems(items => [...items,response.data]);
      setItem('');
      setAmount('');
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  }

  function remove(id) {
    const json = JSON.stringify({id:id});
    axios.post(URL + 'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      const newListWithoutRemoved = items.filter((listItem) => listItem.id !== id);
      setItems(newListWithoutRemoved);
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  }

  return (
    <div className='container'>
      <h3>Shopping list</h3>
      <form onSubmit={save}>
        <label>New item</label>
        <input value={item} placeholder='type description' onChange={e => setItem(e.target.value)} />
        <input value={amount} type='number' className='amount' placeholder='type amount' onChange={e => setAmount(e.target.value)} />
        <button>Add</button>
      </form>
      <ul>
        {items?.map(item => (
          <li key={item.id}><div className='description'>{item.description}</div><div className='amount'>{item.amount}</div>
          <div className='delete'><a onClick={() => remove(item.id)} href='#'>Delete</a></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
