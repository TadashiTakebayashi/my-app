import React, {useState} from 'react';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import ReplayIcon from '@material-ui/icons/Replay';
import { makeStyles } from '@material-ui/core/styles';
import logo from './logo.svg';
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import './App.css';
import { doc } from '@firebase/firestore';

const useStyles = makeStyles((theme) => ({
  Button: {
    margin: theme.spacing(1),
  },
}));

const firebaseConfig = {
  apiKey: "AIzaSyCHH8oeFWVlWpauXbcwpQuo46G51NFkL2M",
  authDomain: "test3-b16d5.firebaseapp.com",
  projectId: "test3-b16d5",
  storageBucket: "test3-b16d5.appspot.com",
  messagingSenderId: "703173257684",
  appId: "1:703173257684:web:4a88c82fb22427d773ce41",
  measurementId: "G-MGPF2XRKWX"
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const [age, setAge] = useState('');
  const [documentId, setDocumentId] = useState('');

  const handleClickFetchButton = async () => {
    const db = firebase.firestore();
    const snapshot = await db
      .collection('users')
      .get();
    const _users = [];
    snapshot.forEach(doc => {
      _users.push({
        userId: doc.id,
        ...doc.data()
      });
    });

    setUsers(_users);
  };

  const handleClickAddButton = async () => {
    if (!userName || !age) {
      alert('"userName" or "age" が空です');
      return;
    }
    const parsedAge = parseInt(age, 10);

    if ( isNaN(parsedAge) ) {
      alert('numberは半角の数値でセットしてください');
      return;
    }

    const db = firebase.firestore();
    const ref = await db.collection('users').add({
      name: userName,
      age: parsedAge
    });

    setUserName('');
    setAge('');
  };

  const handleClickUpdateButton = async () => {
    if (!documentId) {
      alert('documentIdをセットしてください');
      return;
    }

    const newData = {};
    if (userName) {
      newData['name'] = userName;
    }
    if (age) {
      newData['age'] = parseInt(age, 10);
    }

    try {
      const db = firebase.firestore();
      await db.collection('users').doc(documentId).update(newData);
      setUserName('');
      setAge('');
      setDocumentId('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickDeleteButton = async () => {
    // const db = firebase.firestore();
    // db.collection("users").doc("j1N1XqqAAu3q7an9CRM2").delete().then(function() {
    //   console.log("Document successfullu deleted"); 
    // }).catch(function(error) {
    //   console.error("Error removing document: ", error);
    // });
    if (!documentId) {
      alert('documentIdをセットしてください');
      return;
    }

    try {
      const db = firebase.firestore();
      await db.collection('users').doc(documentId).delete();
      setUserName('');
      setAge('');
      setDocumentId('');
    } catch (error) {
      console.error(error);
    }
  };

  const userListItems = users.map(user => {
    return (
      <li key={user.userId}>
        <ul>
          <li>ID : {user.userId}</li>
          <li>name : {user.name}</li>
          <li>age : {user.age}</li>
        </ul>
      </li>
    );
  });

  return (
    <div className="App">
      <h1>REST API React App on Firebase</h1>
      <label htmlFor="username">userName : </label>
      <input
        type="text"
        id="username"
        value={userName}
        onChange={(event) => {setUserName(event.target.value)}}
      />
      <label htmlFor="age">age : </label>
      <input
        type="text"
        id="age"
        value={age}
        onChange={(event) => {setAge(event.target.value)}}
      />
      <label htmlFor="documentId">ID : </label>
      <input
        type="text"
        id="documentId"
        value={documentId}
        onChange={(event) => {setDocumentId(event.target.value)}}
      />
      <Button
        onClick={handleClickFetchButton}
        variant="contained"
        color="primary"
        startIcon={<GetAppIcon />}      
      >
        取得
      </Button>
      <Button
        onClick={handleClickAddButton}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}      
      >
        追加
      </Button>
      <Button
        onClick={handleClickUpdateButton}
        variant="contained"
        color="primary"
        startIcon={<ReplayIcon />}
      >
        更新
      </Button>
      <Button
        onClick={handleClickDeleteButton}
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />}
      >
        削除
      </Button>
      <ul>{userListItems}</ul>
    </div>
  );
}

export default App;
