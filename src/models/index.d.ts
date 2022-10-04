import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type PostMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Post {
  readonly id: string;
  readonly title?: string | null;
  readonly content?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Post, PostMetaData>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post, PostMetaData>) => MutableModel<Post, PostMetaData> | void): Post;
}