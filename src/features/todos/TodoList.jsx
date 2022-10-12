import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: todos,
  } = useQuery("todos", getTodos, {
    select: (data) => data.sort((a, b) => b.id - a.id),
  });

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodoMutation.mutate({ userId: 1, title: newTodo, completed: false });
    setNewTodo("");
  };

  const newItemSection = (
    <form onSubmit={handleSubmit} className='mt-4 w-full'>
      <span>Enter a new todo item</span>
      <div className='flex'>
        <label className='block w-full'>
          <input
            type='text'
            id='new-todo'
            value={newTodo}
            onChange={(e) => {
              setNewTodo(e.target.value);
            }}
            placeholder='Enter new todo'
            className='block w-full'
          />
        </label>
        <button className='px-[15px] bg-black'>
          <FontAwesomeIcon icon={faUpload} className='text-white' />
        </button>
      </div>
    </form>
  );

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else {
    content = todos.map((todo) => (
      <article
        key={todo.id}
        className='flex justify-between border-t border-black py-4'
      >
        <div className='todo'>
          <label class='inline-flex items-center'>
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() =>
                updateTodoMutation.mutate({
                  ...todo,
                  completed: !todo.completed,
                })
              }
            />
            <span class='ml-2'>{todo.title}</span>
          </label>
        </div>
        <button
          onClick={() => deleteTodoMutation.mutate({ id: todo.id })}
          className='py-[10px] px-[15px] bg-red-400'
        >
          <FontAwesomeIcon icon={faTrash} className='text-white' />
        </button>
      </article>
    ));
  }

  return (
    <main className='w-1/3 mx-auto'>
      <h1 className='text-[40px] font-bold'>Todo List</h1>
      {newItemSection}
      <div className='mt-4'>{content}</div>
    </main>
  );
};
export default TodoList;
