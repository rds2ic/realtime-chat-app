import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useFriendStore = create((set) => ({
  searchedUser: null,
  isSearchingForUser: false,
  friend_request_users: [],
  all_users: [],

  getSearchedUser: async (username) => {
    set({ isSearchingForUser: true });
    try {
      const res = await axiosInstance.get(`/friend/find/${username}`);
      set({ searchedUser: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSearchingForUser: false });
    }
  },

  clearSearchedUser: () => {
    set({ searchedUser: null });
  },

  getFriendRequestUsers: async () => {
    try {
      const res = await axiosInstance.get("/friend/friend-requests");
      set({ friend_request_users: res.data });
    } catch (error) {
      console.log(
        "Error - Could not find friend requests: ",
        error.response.data.message
      );
    }
  },

  sendFriendRequest: async (username) => {
    try {
      await axiosInstance.put(`/friend/friend-req/${username}`);
      toast.success(`Sent ${username} a friend request`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  acceptFriendRequest: async (username) => {
    try {
      await axiosInstance.put(`/friend/friend-req/${username}`);
      toast.success(`Added ${username} successfuly`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  rejectFriendRequest: async (username) => {
    try {
      await axiosInstance.put(`/friend/rej-friend-req/${username}`);
      toast.success(`Rejected ${username} successfuly`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  removeFriend: async (username) => {
    try {
      await axiosInstance.put(`/friend/remove-friend/${username}`);
      toast.success(`Removed ${username} successfuly`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getAllUsers: async () => {
    try {
      const res = await axiosInstance.get("/friend/all-users");
      set({ all_users: res.data });
    } catch (error) {
      console.log(
        "Error - could net get all users: ",
        error.response.data.message
      );
    }
  },
}));
