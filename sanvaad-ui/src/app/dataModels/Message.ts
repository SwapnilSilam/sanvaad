import { User } from './User';

export interface Message {
  content: string;
  mid: string;
  user: User;
  time: number;
}
