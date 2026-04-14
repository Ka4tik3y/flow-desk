import { useAuth } from "../auth/AuthContext";

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="mt-6 max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Username</label>
            <p className="mt-1 text-lg text-gray-900">{user?.username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="mt-1 text-lg capitalize text-gray-900">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}