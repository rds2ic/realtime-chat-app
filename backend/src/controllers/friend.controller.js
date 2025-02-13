import User from "../models/user.model.js";

export const friend_req = async (req, res) => {
  try {
    const senderId = req.user._id;
    const senderFriendRequests = req.user.friend_requests;
    const senderFriends = req.user.friends;
    const { username: recUserName } = req.params;

    const receiver = await User.findOne({ username: recUserName });
    if (!receiver) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    const receiverId = receiver._id;

    if (senderFriends.includes(receiverId))
      return res.status(409).json({ message: "User is already a friend" }); // Conflict error code

    // If user has been requested by receiver then make them both friends with each other (accepting initial friend request)
    if (senderFriendRequests.includes(receiverId)) {
      // console.log("A");
      const sender = await User.findById(senderId).select("-password");
      sender.friends = [...senderFriends, receiverId];
      sender.friend_requests = senderFriendRequests.filter(
        (freq) => !freq.equals(receiverId)
      );
      await sender.save();

      receiver.friends = [...receiver.friends, senderId];
      receiver.friend_requests = receiver.friend_requests.filter(
        (freq) => !freq.equals(senderId)
      );
      await receiver.save();

      return res.status(200).json(sender);
    } else {
      // console.log("B");
      // else add senders id to receivers friend request list
      if (receiver.friend_requests.includes(senderId))
        return res
          .status(409)
          .json({ message: "User has already been sent a friend request" });

      receiver.friend_requests = [...receiver.friend_requests, senderId];
      await receiver.save();
      return res.status(200).json(req.user);
    }
  } catch (error) {
    console.log("Error in friend request controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const remove_friend = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { username: recUserName } = req.params;

    const receiver = await User.findOne({ username: recUserName });
    if (!receiver) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    const receiverId = receiver._id;

    const sender = await User.findById(senderId).select("-password");
    if (!sender.friends.includes(receiverId))
      return res.status(409).json({ message: "User is not a friend" });

    sender.friends = sender.friends.filter(
      (friend) => !friend.equals(receiverId)
    );
    await sender.save();

    receiver.friends = receiver.friends.filter(
      (friend) => !friend.equals(senderId)
    );
    await receiver.save();

    return res.status(200).json(sender);
  } catch (error) {
    console.log("Error in remove friend controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const find_friend = async (req, res) => {
  try {
    const { username: recUserName } = req.params;
    const receiver = await User.findOne({ username: recUserName }).select(
      "-password"
    );
    if (!receiver) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(receiver);
  } catch (error) {
    console.log("Error in find_friend controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const get_friend_requests = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $in: req.user.friend_requests },
    }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in get friend requests controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const reject_friend_req = async (req, res) => {
  try {
    const senderId = req.user._id;

    const { username: recUserName } = req.params;

    const receiver = await User.findOne({ username: recUserName });
    if (!receiver) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    const receiverId = receiver._id;

    const sender = await User.findById(senderId).select("-password");
    if (!sender.friend_requests.includes(receiverId))
      return res
        .status(409)
        .json({ message: "User hasn't sent a friend request" });

    sender.friend_requests = sender.friend_requests.filter(
      (friend_req) => !friend_req.equals(receiverId)
    );
    await sender.save();

    return res.status(200).json(sender);
  } catch (error) {
    console.log("Error in reject friend request controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsersForFriendsHub = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // this logic is finding all users with user id not equal ($ne) to the one that is logged in
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
