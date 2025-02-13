import { useFriendStore } from "../store/useFriendStore";

const UserGrid = ({ users }) => {
  const { getSearchedUser } = useFriendStore();
  const handle_click = async (username) => {
    getSearchedUser(username);
  };
  return (
    <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-10 p-6 w-full">
      {users.map((user) => (
        <button
          key={user._id}
          type="button"
          onClick={() => handle_click(user.username)}
          className="w-full"
        >
          <div className="w-full h-full min-h-[120px] flex flex-col items-center justify-center gap-3 hover:bg-base-300 transition-colors bg-base-300 rounded-md hover:scale-95 px-6 py-4">
            {/* User Avatar */}
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
            </div>

            {/* User Info */}
            <div className="flex flex-1 flex-col text-left min-w-0">
              <div className="lg:block font-medium">{user.fullName}</div>
              <div className="lg:block text-sm truncate text-base-content/60">
                {user.username}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
export default UserGrid;
