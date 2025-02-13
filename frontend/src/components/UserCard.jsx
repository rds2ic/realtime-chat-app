import { Check, X } from "lucide-react";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

const UserCard = ({ f }) => {
  const {
    searchedUser,
    clearSearchedUser,
    sendFriendRequest,
    getFriendRequestUsers,
    removeFriend,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useFriendStore();
  const { onlineUsers, authUser, updateAuthUser } = useAuthStore();
  const { getUsers } = useChatStore();

  const [isFriend, setIsFriend] = useState(
    authUser.friends.includes(searchedUser._id)
  );
  const [hasRequested, setHasRequested] = useState(
    authUser.friend_requests.includes(searchedUser._id)
  );

  const handle_accept = async () => {
    try {
      await acceptFriendRequest(searchedUser.username);
      setHasRequested(false);
      setIsFriend(true);
      getFriendRequestUsers();
      getUsers();
      updateAuthUser();
    } catch (error) {
      console.log(error);
    }
  };
  const handle_reject = async () => {
    try {
      await rejectFriendRequest(searchedUser.username);
      setHasRequested(false);
      setIsFriend(false);
      getFriendRequestUsers();
      getUsers();
      updateAuthUser();
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveFriend = async () => {
    try {
      await removeFriend(searchedUser.username);
      setIsFriend(false);
      updateAuthUser();
    } catch (error) {
      console.log(error);
    }
  };
  const handleRequestFriend = async () => {
    try {
      await sendFriendRequest(searchedUser.username);
      updateAuthUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 y-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-1">
          <div className="flex items-center w-full">
            <div className="w-1/3"></div>
            <div className="w-1/3 flex justify-center">
              <p
                className={`mt-2 text-center ${
                  onlineUsers.includes(searchedUser._id)
                    ? "text-green-500"
                    : "text-yellow-300"
                }`}
              >
                {searchedUser.username}
              </p>
            </div>
            <div className="w-1/3 flex justify-end">
              <button
                onClick={() => {
                  f("");
                  clearSearchedUser();
                }}
                className="hover:scale-110 transition-all duration-200"
              >
                <X />
              </button>
            </div>
          </div>
          <div className="space-y-1 p-2">
            <p className="text-center text-xs">
              {searchedUser.createdAt?.split("T")[0]}
            </p>
          </div>
          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={searchedUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 hover:scale-75 transition-all duration-200"
              />
            </div>
          </div>
          <div className="py-2">
            <p className="text-center font-semibold text-lg">
              {searchedUser.fullName}
            </p>
          </div>
          {hasRequested && (
            <>
              <p className="text-center">
                Accept friend request from {searchedUser.username}?
              </p>
              <div className="flex flex-row items-center justify-center gap-5 pt-3">
                <button
                  type="button"
                  className="btn btn-sm rounded-large btn-error"
                  onClick={() => handle_reject()}
                >
                  <X />
                </button>
                <button
                  type="button"
                  className="btn btn-sm rounded-large btn-success"
                  onClick={() => handle_accept()}
                >
                  <Check />
                </button>
              </div>
            </>
          )}
          {isFriend && (
            <>
              <div className="flex flex-row items-center justify-center">
                <button
                  type="button"
                  className="btn btn-primary rounded-large"
                  onClick={() => handleRemoveFriend()}
                >
                  Remove Friend
                </button>
              </div>
            </>
          )}
          {!isFriend && !hasRequested && (
            <>
              <div className="flex flex-row items-center justify-center">
                <button
                  type="button"
                  className="btn btn-secondary rounded-large"
                  onClick={() => handleRequestFriend()}
                >
                  Add Friend
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserCard;
