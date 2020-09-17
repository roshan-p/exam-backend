import { Room } from "../../models/room";
import { Message } from "../../models/message";
import { Sender } from "../../models/sender";
const NEW_MESSAGE = "NEW_MESSAGE"
export default {
  Query: {
    Message: async (_, args) => {
      const { roomName } = args
      return Message.find({ roomName: roomName });
    },
    Room: async (_, args) => {
      const { roomName } = args
      return Room.find({ roomName: roomName });
    },
    Sender: async (_, args) => {
      const { name } = args
      return Sender.find({ name: name });
    }
  },
  Mutation: {
    createSender: async (_, { name }) => {
      const getSender = await Sender.find({ name: name });
      if (getSender.length == 0) {
        const sender = new Sender({ name });
        await sender.save();
        return sender;
      }
    },
    createRoom: async (_, { roomName  }) => {
      const getRoom = await Room.find({ roomName: roomName });
      if (getRoom.length == 0) {
        const room = new Room({ roomName });
        await room.save();
        return room;
      }
    },
    sendMessage: async (_, { body, image, from, timestamp, roomName }, { pubsub }) => {
      const message = new Message({ body, image, from, timestamp, roomName });
      await message.save();
      pubsub.publish(NEW_MESSAGE, { newMessage: message })
      return message;
    }
  },
  Subscription: {
    newMessage: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator([NEW_MESSAGE])
    }
  }
};
