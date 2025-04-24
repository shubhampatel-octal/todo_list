import { ITodos } from "../type";

interface ListTodosProps {
  todos: ITodos[];
  handleEditButton: (todo: ITodos) => void;
  handledeleteButton: (id: string) => void;
  handleClearItems: () => void;
  handleCheckItems: (check: boolean, id: string) => void;
}

const ListTodos = ({
  todos,
  handleEditButton,
  handledeleteButton,
  handleClearItems,
  handleCheckItems,
}: ListTodosProps) => {
  return (
    <div className="mt-8">
      <div className="p-1 pb-4 w-full">
        <h2 className="text-center text-2xl text-amber-400">Not Done</h2>
        {todos?.map((todo) => {
          return (
            !todo.chacked && (
              <article
                key={todo._id}
                className="px-4 py-1 mb-2 flex items-center justify-between text-base border-b border-[#ffc727] rounded-sm hover:bg-[#f0f0f0] hover:text-[#617d98] transition-all duration-300 ease-linear capitalize"
              >
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    className="w-4"
                    checked={todo.chacked}
                    onChange={() => handleCheckItems(!todo.chacked, todo._id)}
                  />
                  <p className="text-[#102a42] tracking-[2px]">{todo.title}</p>
                </div>
                <div className="flex gap-5 ">
                  <button
                    type="button"
                    className="text-[#f4ae00] cursor-pointer text-lg"
                    onClick={() => handleEditButton(todo)}
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 576 512"
                      className="icons"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="text-[red] cursor-pointer text-lg"
                    onClick={() => handledeleteButton(todo._id)}
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 448 512"
                      className="icons"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path>
                    </svg>
                  </button>
                </div>
              </article>
            )
          );
        })}
      </div>
      <div className="p-1 pb-4 w-full">
        <h2 className="text-center text-2xl text-amber-400">Done</h2>
        {todos?.map((todo) => {
          return (
            todo.chacked && (
              <article
                key={todo._id}
                className="px-4 py-1 mb-2 flex items-center justify-between text-base border-b border-[#ffc727] rounded-sm hover:bg-[#f0f0f0] hover:text-[#617d98] transition-all duration-300 ease-linear capitalize"
              >
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={todo.chacked}
                    onChange={() => handleCheckItems(!todo.chacked, todo._id)}
                    className="w-4"
                  />
                  <p className="text-[#102a42] tracking-[2px]">{todo.title}</p>
                </div>
                <div className="flex gap-5 ">
                  <button
                    type="button"
                    className="text-[#f4ae00] cursor-pointer text-lg"
                    onClick={() => handleEditButton(todo)}
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 576 512"
                      className="icons"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="text-[red] cursor-pointer text-lg"
                    onClick={() => handledeleteButton(todo._id)}
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 448 512"
                      className="icons"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path>
                    </svg>
                  </button>
                </div>
              </article>
            )
          );
        })}
      </div>
      <button
        className="py-2 px-8 m-[1.5rem_auto_0] grid items-center text-[.85rem] font-bold rounded-sm bg-[#ffc727] tracking-[2px] capitalize hover:text-white transition-all duration-300 ease-linear"
        onClick={handleClearItems}
      >
        Clear Items
      </button>
    </div>
  );
};

export default ListTodos;
