import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });

  const handleinput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!user.username) {
        toast.error("please Enter your Username");
        return;
      }

      if (!user.email) {
        toast.error("please Enter your email");
        return;
      }

      if (!user.password) {
        toast.error("please Enter your password");
        return;
      }
      const responce = await fetch("http://localhost:3000/signup", {
        body: JSON.stringify({ ...user }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const result = await responce.json();
      console.log(responce);
      console.log(result);

      if (responce.status !== 200) {
        toast.error(result.msg);
        return;
      }

      toast.success(result.msg);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error("somethis wrong");
      console.log(err);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-96 h-auto p-4 bg-white rounded-md shadow-2xl">
        <div className="text-center text-2xl mt-1 mb-4">Sign up</div>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            User Name
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleinput}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="Shubham"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleinput}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="shubham@gmail.com"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleinput}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="**********"
            required
          />
        </div>
        <div className="w-full">
          <button
            type="button"
            className="w-full text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:ring-2 active:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
            onClick={handleSubmit}
          >
            Sign up
          </button>
        </div>
        <div className="text-center mt-1">
          <span>
            If you have Account{" "}
            <Link className="underline" to={"/signin"}>
              Click here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
