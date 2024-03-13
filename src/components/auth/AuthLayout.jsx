import { Toaster } from "react-hot-toast";

export const AuthLayout = ({ children }) => {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      {/* <Toaster position="top-center" /> */}
      <div className="">{children}</div>
    </main>
  );
};
