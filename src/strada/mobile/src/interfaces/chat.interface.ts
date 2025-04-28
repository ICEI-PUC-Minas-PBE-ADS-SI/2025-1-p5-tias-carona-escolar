interface Sender {
  id: string;
  nickname: string;
}

interface Message {
  id: string;
  sender: Sender;
  content: string;
  sendAt: string;
}

interface MessageSent {
  content: string;
}

interface Team {
  id: string;
  roomName: string;
  description: string;
  membersCount: number;
  imgUrl: string;
  messages: Message[];
}
