export interface Category {
    name: string;
    id: number;
    restaurantId: number;
  }
export type NewCategory = Omit<Category, "id">;

export interface UpdateCategoryRequestDto {
  name: string;
}
