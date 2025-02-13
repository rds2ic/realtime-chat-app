import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import UserCard from "../components/UserCard";
import UserGrid from "../components/UserGrid";
import { useFriendStore } from "../store/useFriendStore";

const FriendsPage = () => {
  const { getUsers, users } = useChatStore();
  const {
    searchedUser,
    getSearchedUser,
    clearSearchedUser,
    getFriendRequestUsers,
    friend_request_users,
    all_users,
    getAllUsers,
  } = useFriendStore();

  useEffect(() => {
    getUsers();
    getFriendRequestUsers();
    clearSearchedUser();
    getAllUsers();
  }, [getUsers, getFriendRequestUsers, clearSearchedUser, getAllUsers]);

  const [text, setText] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(text);
    try {
      getSearchedUser(text);
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  if (searchedUser) return <UserCard f={setText} />;

  return (
    <div className="h-screen flex flex-col items-center text-center pt-20 bg-base-100 overflow-y-auto">
      <h1 className="text-4xl font-bold text-base-600">Hub</h1>
      <div className="flex flex-row items-center justify-center gap-2 mt-4">
        <form
          onSubmit={handleSubmit}
          className="input input-bordered flex items-center gap-2"
        >
          <input
            type="text"
            className="grow"
            placeholder="Search for usernames"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <input type="submit" hidden />
          <button
            className="btn btn-sm btn-circle bg-transparent"
            type="submit"
            disabled={!text.trim()}
          >
            <Search />
          </button>
        </form>
      </div>
      {/* Friend requests */}
      <div className="collapse collapse-arrow bg-base-200 mt-4">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          Requests ({friend_request_users.length})
        </div>
        <div className="collapse-content">
          <UserGrid users={friend_request_users} />
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200 mt-1">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">Friends</div>
        <div className="collapse-content">
          <UserGrid users={users} />
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200 mt-1">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">All Users</div>
        <div className="collapse-content">
          <UserGrid users={all_users} />
        </div>
      </div>
    </div>
  );
};
export default FriendsPage;
