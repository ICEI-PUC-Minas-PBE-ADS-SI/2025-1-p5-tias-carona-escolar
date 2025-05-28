export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  imgUrl: string;
  username: string;
  password?: string;
  authProvider?: string;
  numberOfRecipes?: number;
  numberOfFollowers?: number;
  numberOfFollowings?: number;
  createdAt?: Date;
  isActive?: boolean;
}
