//! Database configuration for our project

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore,
  onSnapshot,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkodBPzUlFkIN9MWD0KgOMpYWkxKUJw78",
  authDomain: "todofirestoremustafa.firebaseapp.com",
  projectId: "todofirestoremustafa",
  storageBucket: "todofirestoremustafa.appspot.com",
  messagingSenderId: "259378051433",
  appId: "1:259378051433:web:7246c7d2bb2e033ac325f8",
  measurementId: "G-ZQTW7DXBVG",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let inputField = document.getElementById("inputField");
let addButton = document.getElementById("addButton");
let deleteButton = document.getElementById("deleteButton");
let todosList = document.getElementById("todosList");
let displayTodo = document.getElementById("displayTodo");
let showTodos = document.getElementById("showAll");

const uploadingDataInFireStore = async () => {
  let inputValue = inputField.value;

  if (inputValue.trim()) {
    const idForDb = new Date().getTime();
    const payload = {
      id: idForDb,
      todos: inputValue,
    };

    await setDoc(doc(db, "todos", `${idForDb}`), payload);
    alert("Todo Added Successfully !");
    inputField.value = " ";
  } else {
    alert("Input Field cannot be empty !");
  }
};

const fetchingDataFromFireStore = async () => {
  let itemCollection = "";
  const q = query(collection(db, "todos"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const todos = [];
    querySnapshot.forEach((doc) => {
      todos.push(doc.data());
    });
    console.log(todos);
      itemCollection = todos
        .map(
          (collectionOfTodos) =>
            `<li>${collectionOfTodos.todos}<button class = "btn btn-outline-primary mx-2 mb-2" onclick = "editTodos('${collectionOfTodos.id}')">Edit</button><button class = "btn btn-outline-danger mb-2" onclick = "deleteTodos('${collectionOfTodos.id}')">Delete</button></li>`
        )
        .join("");
      displayTodo.style.display = "block";
      todosList.innerHTML = itemCollection;
      window.editTodos = async function (id) {
        const input = prompt("Enter the change that you want : ");
        if (input !== null) {
          await updateDoc(doc(db, "todos", id), { todos: input });
        }
      };
      window.deleteTodos = async function (id) {
        await deleteDoc(doc(db, "todos", id));
        alert("Todo Deleted Successfully !");
      };
  });
};

const deleteAllTodos = async () => {
  const q = query(collection(db, "todos"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
    displayTodo.style.display = "none";
  });
  alert("All Todos Deleted !");
};

addButton.addEventListener("click", uploadingDataInFireStore);
showTodos.addEventListener("click", fetchingDataFromFireStore);
deleteButton.addEventListener("click", deleteAllTodos);
