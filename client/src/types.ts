export interface Option {
  _id: string;
  title: string;
  votes: number;
}

export interface Poll {
  _id: string;
  prompt: string;
  author: string;
  totalVoteCount: number;
  createdAt: Date;
  updatedAt: Date;
  options: Partial<Option>[];
}
