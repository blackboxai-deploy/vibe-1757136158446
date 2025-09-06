export interface MenuItem {
  id: string;
  name: string;
  selected: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

export const initialMenuData: MenuCategory[] = [
  {
    id: 'appetizers',
    title: 'Appetizers',
    subtitle: '(First Course)',
    items: [
      { id: 'app1', name: 'Potato Croquettes', selected: false },
      { id: 'app2', name: 'Divilled Egg', selected: false },
      { id: 'app3', name: 'Cucumber Salad', selected: false },
      { id: 'app4', name: 'Salted Egg Salad', selected: false },
    ],
  },
  {
    id: 'soups',
    title: 'Soups',
    subtitle: '(Second Course)',
    items: [
      { id: 'soup1', name: 'Crab & Corn Chowder Soup', selected: false },
      { id: 'soup2', name: 'Eggdrop Soup', selected: false },
      { id: 'soup3', name: 'Birdsnest Soup', selected: false },
      { id: 'soup4', name: 'Cream of Mushroom', selected: false },
      { id: 'soup5', name: 'Shrimp Sinigang', selected: false },
      { id: 'soup6', name: 'Chicken Tinola', selected: false },
      { id: 'soup7', name: 'Fish Tinola', selected: false },
    ],
  },
  {
    id: 'salads',
    title: 'Salads',
    subtitle: '(Third Course)',
    items: [
      { id: 'salad1', name: 'Fruit Salad', selected: false },
      { id: 'salad2', name: 'Tropical Fruits', selected: false },
    ],
  },
  {
    id: 'pork_dishes',
    title: 'Main Course - Pork Dishes',
    items: [
      { id: 'pork1', name: 'Pork Bicol Express', selected: false },
      { id: 'pork2', name: 'Oven Baked Pork in White Sauce', selected: false },
      { id: 'pork3', name: 'Grilled Pork Chop', selected: false },
      { id: 'pork4', name: 'Lechon Belly', selected: false },
      { id: 'pork5', name: 'Pork Belly with Black Soy Sauce', selected: false },
      { id: 'pork6', name: 'Pork Pineapple Glaze', selected: false },
      { id: 'pork7', name: 'Pork Bisteak', selected: false },
      { id: 'pork8', name: 'Humba', selected: false },
      { id: 'pork9', name: 'Sweet & Sour Pork', selected: false },
      { id: 'pork10', name: 'Pork Lumpia', selected: false },
    ],
  },
  {
    id: 'chicken_dishes',
    title: 'Main Course - Chicken Dishes',
    items: [
      { id: 'chick1', name: 'Roasted Chicken', selected: false },
      { id: 'chick2', name: 'Chicken Inato Style', selected: false },
      { id: 'chick3', name: 'Grilled Chicken Teriyaki', selected: false },
      { id: 'chick4', name: 'Sweet & Sour Chicken', selected: false },
      { id: 'chick5', name: 'Orange Chicken', selected: false },
      { id: 'chick6', name: 'Chicken Afritada', selected: false },
      { id: 'chick7', name: 'Fried Chicken Wings with Gravy', selected: false },
      { id: 'chick8', name: 'Buttered Chicken', selected: false },
    ],
  },
  {
    id: 'seafood_dishes',
    title: 'Main Course - Seafood Dishes',
    items: [
      { id: 'sea1', name: 'Mixed Seafoods with Oyster Sauce', selected: false },
      { id: 'sea2', name: 'Mixed Seafoods with Coconut Milk', selected: false },
      { id: 'sea3', name: 'Garlic Shrimp', selected: false },
      { id: 'sea4', name: 'Sweet Chili Mixed Seafoods', selected: false },
      { id: 'sea5', name: 'Tuna Panga', selected: false },
      { id: 'sea6', name: 'Seafood Monggo', selected: false },
    ],
  },
  {
    id: 'vegetables',
    title: 'Vegetables',
    items: [
      { id: 'veg1', name: 'Sauteed Vegetables with Garlic', selected: false },
      { id: 'veg2', name: 'Stir Fried (Strips) Vegetables', selected: false },
      { id: 'veg3', name: 'Special Pinakbet', selected: false },
      { id: 'veg4', name: 'Chopsuey', selected: false },
      { id: 'veg5', name: 'Steamed Vegetables', selected: false },
      { id: 'veg6', name: 'Mixed Vegetables in Oyster Sauce', selected: false },
      { id: 'veg7', name: 'Ginataang Gulay', selected: false },
    ],
  },
  {
    id: 'noodles_pasta',
    title: 'Noodles & Pasta',
    items: [
      { id: 'nood1', name: 'Pancit Palabok', selected: false },
      { id: 'nood2', name: 'Bihon Guisado', selected: false },
      { id: 'nood3', name: 'Cantoon Guisado', selected: false },
      { id: 'nood4', name: 'Bam-I', selected: false },
      { id: 'nood5', name: 'Aglio Olio', selected: false },
      { id: 'nood6', name: 'Carbonara', selected: false },
      { id: 'nood7', name: 'Marinara', selected: false },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    items: [
      { id: 'dess1', name: 'Choco Cake', selected: false },
      { id: 'dess2', name: 'Banana Cake', selected: false },
      { id: 'dess3', name: 'Mango Sago', selected: false },
    ],
  },
];