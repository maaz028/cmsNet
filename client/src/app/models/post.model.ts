
export interface Post {
  id?: string,
  title: string
  permalink: string
  category: PostCategory
  postImgPath: string
  excerpt: string
  content: string
  isFeatured?: boolean
  views?: number
  status?: string,
    message?: string
  createdAt?: Date,
  updatedAt?: Date,
}

export interface PostCategory {
  catID: string
  catName: string,
}

export interface PhotoImage {
  id: string
  photo: string
  name: string
  size: string
  type: string
  photoPath: string,
  message: string,
}

export interface PostsData {
  featuredPosts: Post[];
  posts: Post[];
}

export interface PostsDetailsData {
  postDetails: Post;
  nextPosts: Post[];
}


