import React, { useEffect, useState } from "react";
import styles from "./todo.module.css";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

const TodoList = () => {
  const [todo, setTodo] = useState({
    Title: "",
    Description: "",
    Complete: false,
  });

  const [todoList, setTodoList] = useState(() => {
    const savedTodos = localStorage.getItem("todo");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });


  const [editIndex, setEditIndex] = useState(-1);
  const [isDelete, setDelete] = useState(false);
  const [filterData, setFilterData] = useState("");

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(todoList));
  }, [todoList]);

  const notify = (notice) =>
    toast.error(notice, {
      style: {
        background: "red",
        color: "white",
        fontWeight: "bold",
      },
    });

  const handleOnChange = (e) => {
    setTodo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = () => {
    if (todo.Title.trim() !== "" && todo.Description.trim() !== "") {
      setTodoList([...todoList, todo]);
      setTodo({
        Title: "",
        Description: "",
        Complete: false,
      });
    } else {
      const title = "Please Enter Title";
      const dep = "Please Enter Description";
      todo.Title.trim() !== "" ? notify(dep) : notify(title);
    }
  };

  const handleDelete = (index) => {
    const newList = todoList.filter((_, i) => i !== index);
    setTodoList(newList);
  };

  const handleEdit = (index) => {
    setTodo({
      Title: todoList[index].Title,
      Description: todoList[index].Description,
      Complete: todoList[index].Complete,
    });
    setEditIndex(index);
    setDelete(true);
  };

  const updateHandle = () => {
    const updatedData = [...todoList];
    updatedData[editIndex] = todo;
    setTodoList(updatedData);
    setEditIndex(-1);
    setTodo({
      Title: "",
      Description: "",
      Complete: false,
    });
    setDelete(false);
  };

  const handleChecked = (index) => {
    const checkedTodo = [...todoList];
    checkedTodo[index].Complete = !checkedTodo[index].Complete;
    setTodoList(checkedTodo);
  };

  const searchTodo = (e) => {
    setFilterData(e.target.value.toLowerCase());
  };

  const filteredTodos = todoList.filter(
    (todo) =>
      todo.Title.toLowerCase().includes(filterData) ||
      todo.Description.toLowerCase().includes(filterData)
  );

  return (
    <div className={styles.container}>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className={styles.inputField}>
        <div className={styles.inputFill}>
          <label htmlFor="Title">Title</label>
          <input
            type="text"
            name="Title"
            placeholder="What's the Title of your To Do?"
            onChange={handleOnChange}
            value={todo.Title}
          />
        </div>
        <div className={styles.inputFill}>
          <label htmlFor="Description">Description</label>
          <input
            type="text"
            name="Description"
            placeholder="What's the description of your To Do?"
            onChange={handleOnChange}
            value={todo.Description}
          />
        </div>
        <button
          className={styles.add}
          onClick={editIndex === -1 ? handleAdd : updateHandle}
        >
          {editIndex === -1 ? "Add" : "Update"}
        </button>
      </div>
      <hr className={styles.hr} />
      <h2>Your Todo</h2>
      <hr className={styles.hr1} />
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search Your Todos"
          onChange={searchTodo}
        />
        <FiSearch size={24} className={styles.sicon} />
      </div>

      {filteredTodos && filteredTodos.length > 0 ? (
        filteredTodos.map((list, index) => (
          <div key={index} className={styles.listTable}>
            <input
              type="checkbox"
              checked={list.Complete}
              onChange={() => handleChecked(index)}
            />
            <h4 className={list.Complete ? `${styles.DoneTitle}` : undefined}>
              {list.Title}
            </h4>
            <p className={list.Complete ? `${styles.line}` : `${styles.ok}`}>
              {list.Description}
            </p>
            <div className={styles.btn}>
              <CiEdit
                size={24}
                onClick={() => handleEdit(index)}
              />
              {!isDelete && (
                <MdDeleteForever
                  size={24}
                  onClick={() => handleDelete(index)}
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <div className={styles.addtodo}>Please add your Todo</div>
      )}
    </div>
  );
};

export default TodoList;
