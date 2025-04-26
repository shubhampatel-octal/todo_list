import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ImageBox from '../components/ImageBox';
import ListTodos from '../components/ListTodos';
import { ITodos } from '../type';
import { useAuth } from '../context';
import Sidebar from '../components/Sidebar';

function Home() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<ITodos[] | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isEdit, SetIsEdit] = useState({
    clicked: false,
    todo: { title: '', _id: '' },
  });
  const { user, setUser } = useAuth();

  useEffect(() => {
    try {
      const getData = async () => {
        const responce = await fetch('http://localhost:3000/getitems', {
          credentials: 'include',
        });

        if (responce.status !== 200) {
          toast.error('Error getting data');
        }

        const data: ITodos[] = await responce.json();
        if (data.length <= 0) {
          setTodos(null);
          return;
        }

        setTodos(data);
      };
      getData();
    } catch (err) {
      toast.error('somethis wrong');
      console.log(err);
    }
  }, []);

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  const handleSubmit = async () => {
    try {
      if (todo.trim() === '') {
        toast.error('Please Enter Value');
        return;
      }

      if (todos?.find((t) => t.title.toLowerCase() === todo.trim().toLowerCase())) {
        toast.error('todo already added');
        return;
      }

      const responce = await fetch('http://localhost:3000/additem', {
        body: JSON.stringify({ todo: todo.trim() }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'POST',
      });

      if (responce.status !== 200) {
        toast.error('Error Adding data');
        return;
      }

      const result = await responce.json();

      setTodos([...(todos || []), result]);
      setTodo('');
      toast.success('New Task Added To The List');
    } catch (err) {
      console.log(err);
      toast.error('somethis wrong');
    }
  };

  const handleEditButton = (todo: ITodos) => {
    SetIsEdit({ clicked: true, todo });
    setTodo(todo.title);
  };

  const handledeleteButton = async (id: string) => {
    try {
      const responce = await fetch('http://localhost:3000/deleteitem', {
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'DELETE',
      });

      if (responce.status !== 200) {
        toast.error('Error Deleting data');
        return;
      }

      const result = await responce.json();
      setTodos(todos?.filter((t) => t._id !== result._id) || null);

      toast.error('Task Removed');
    } catch (err) {
      console.log(err);
      toast.error('somethis wrong');
    }
  };

  const handleCheckItems = async (check: boolean, id: string) => {
    try {
      const responce = await fetch('http://localhost:3000/checkitem', {
        body: JSON.stringify({ check: check, id }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'PUT',
      });

      if (responce.status !== 200) {
        toast.error('Error Checking data');
        return;
      }

      const result: ITodos = await responce.json();
      console.log(result);

      setTodos(todos?.map((t) => (t._id === id ? result : t)) || null);
      SetIsEdit({
        clicked: false,
        todo: { title: '', _id: '' },
      });
      setTodo('');
      toast.success('Value Changed');
    } catch (err) {
      console.log(err);
      toast.error('somethis wrong');
    }
  };

  const handleUpdate = async () => {
    try {
      if (todo.trim() === '') {
        toast.error('Please Enter Value');
        return;
      }

      const responce = await fetch('http://localhost:3000/edititem', {
        body: JSON.stringify({ todo, id: isEdit?.todo?._id }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'PUT',
      });

      if (responce.status !== 200) {
        toast.error('Error Updating data');
        return;
      }

      const result: ITodos = await responce.json();
      console.log(result);

      setTodos(todos?.map((t) => (t._id === isEdit.todo._id ? result : t)) || null);
      SetIsEdit({
        clicked: false,
        todo: { title: '', _id: '' },
      });
      setTodo('');
      toast.success('Value Changed');
    } catch (err) {
      console.log(err);
      toast.error('somethis wrong');
    }
  };

  const handleClearItems = async () => {
    try {
      const responce = await fetch('http://localhost:3000/clearitems', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'DELETE',
      });

      if (responce.status !== 200) {
        toast.error('Error Clearing data');
        return;
      }

      setTodos(null);
      toast.error('Empty List');
    } catch (err) {
      console.log(err);
      toast.error('somethis wrong');
    }
  };
  const handleLogout = async () => {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <>
      <Sidebar />
      <div className="flex w-full justify-end">
        <div className="min-h-screen w-[85%] scroll-auto px-4 py-10">
          <section className="mx-auto w-[90vw] max-w-2xl rounded-xl bg-white px-6 py-6 shadow-lg transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <div className="text-lg font-semibold text-gray-800 capitalize">
                Welcome, {user?.username}
              </div>

              <button
                onClick={handleLogout}
                className="rounded-md border border-red-500 bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white hover:text-red-500"
              >
                Logout
              </button>
            </div>

            {/* Input & Submit */}
            <div className="mb-6 flex rounded-md shadow-sm">
              <input
                className="w-full rounded-l-md border border-amber-400 bg-gray-100 px-4 py-2 text-base focus:outline-amber-500"
                placeholder="Enter a new task to do"
                value={todo}
                onKeyDown={handleInputKeyPress}
                onChange={(e) => setTodo(e.target.value)}
              />
              <button
                ref={buttonRef}
                onClick={isEdit.clicked ? handleUpdate : handleSubmit}
                className="rounded-r-md bg-yellow-400 px-5 text-sm font-bold tracking-wide text-white uppercase transition hover:bg-yellow-500"
              >
                {isEdit.clicked ? 'Edit' : 'Submit'}
              </button>
            </div>

            {/* Task List */}
            {todos && (
              <ListTodos
                todos={todos}
                handleEditButton={handleEditButton}
                handledeleteButton={handledeleteButton}
                handleClearItems={handleClearItems}
                handleCheckItems={handleCheckItems}
              />
            )}

            {/* Image Box */}
            <ImageBox />
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
