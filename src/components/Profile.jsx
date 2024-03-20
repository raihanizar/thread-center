"use client"

export function Profile({ userData }) {

  return (
    <main className="grow flex flex-col gap-8 p-8 md:p-20 justify-center items-center">
      <h1 className="text-3xl font-bold">Edit Profile</h1>
      <div className="flex flex-col gap-6 p-6 border border-slate-900 rounded-xl">
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="input input-primary"
            defaultValue={userData?.username}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input input-primary"
            defaultValue={userData?.email}
          />
        </div>
        <button
          className="w-full btn btn-active bg-blue-500 hover:bg-blue-600 text-white"
          type="submit">Save Changes</button>
      </div>
    </main>
  )
}