import { useEffect, useState } from 'react';
import { supabase } from './supabase';

type Todo = {
  id: number;
   name: string;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function getTodos() {
      const { data, error } = await supabase.from('todos').select();

      if (error) {
        console.error('No se pudieron cargar las tareas:', error.message);
        return;
      } else {
        console.log('Todo ha cargado correctamente:', data);
      }

      if (data) {
        setTodos(data);
      }
    }

    getTodos();
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}
