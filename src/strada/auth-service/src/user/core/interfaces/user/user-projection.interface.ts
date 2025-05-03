export interface IUserProjection {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  numberOfRecipes?: number;
  numberOfFollowers?: number;
  numberOfFollowings?: number;
}
