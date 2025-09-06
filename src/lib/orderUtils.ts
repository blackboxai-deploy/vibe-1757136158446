import { MenuCategory } from './menuData';

export interface OrderSummary {
  id: string;
  title: string;
  date: string;
  selectedItems: {
    categoryTitle: string;
    items: string[];
  }[];
  totalItems: number;
}

export interface SavedOrder {
  id: string;
  title: string;
  date: string;
  menuData: MenuCategory[];
}

// Local storage keys
export const STORAGE_KEYS = {
  SAVED_ORDERS: 'banquet_saved_orders',
  CURRENT_DRAFT: 'banquet_current_draft',
} as const;

// Generate unique ID
export const generateOrderId = (): string => {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get selected items from menu data
export const getSelectedItems = (menuData: MenuCategory[]): OrderSummary['selectedItems'] => {
  return menuData
    .map(category => ({
      categoryTitle: category.title,
      items: category.items.filter(item => item.selected).map(item => item.name),
    }))
    .filter(category => category.items.length > 0);
};

// Count total selected items
export const getTotalSelectedItems = (menuData: MenuCategory[]): number => {
  return menuData.reduce((total, category) => {
    return total + category.items.filter(item => item.selected).length;
  }, 0);
};

// Create order summary
export const createOrderSummary = (
  title: string,
  menuData: MenuCategory[]
): OrderSummary => {
  return {
    id: generateOrderId(),
    title,
    date: new Date().toISOString(),
    selectedItems: getSelectedItems(menuData),
    totalItems: getTotalSelectedItems(menuData),
  };
};

// Save order to local storage
export const saveOrder = (title: string, menuData: MenuCategory[]): void => {
  try {
    const savedOrders = getSavedOrders();
    const newOrder: SavedOrder = {
      id: generateOrderId(),
      title,
      date: new Date().toISOString(),
      menuData: JSON.parse(JSON.stringify(menuData)), // Deep clone
    };
    
    savedOrders.push(newOrder);
    localStorage.setItem(STORAGE_KEYS.SAVED_ORDERS, JSON.stringify(savedOrders));
  } catch (error) {
    console.error('Failed to save order:', error);
    throw new Error('Failed to save order');
  }
};

// Get saved orders from local storage
export const getSavedOrders = (): SavedOrder[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_ORDERS);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load saved orders:', error);
    return [];
  }
};

// Delete saved order
export const deleteSavedOrder = (orderId: string): void => {
  try {
    const savedOrders = getSavedOrders();
    const filtered = savedOrders.filter(order => order.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.SAVED_ORDERS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete order:', error);
    throw new Error('Failed to delete order');
  }
};

// Save current draft
export const saveDraft = (title: string, menuData: MenuCategory[]): void => {
  try {
    const draft = {
      title,
      menuData,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_DRAFT, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};

// Load current draft
export const loadDraft = (): { title: string; menuData: MenuCategory[] } | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
};

// Clear current draft
export const clearDraft = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_DRAFT);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
};

// Generate email body for order
export const generateEmailBody = (title: string, menuData: MenuCategory[]): string => {
  const selectedItems = getSelectedItems(menuData);
  const totalItems = getTotalSelectedItems(menuData);
  
  let emailBody = `Banquet Menu Order: ${title}\n\n`;
  emailBody += `Order Date: ${new Date().toLocaleDateString()}\n`;
  emailBody += `Total Items Selected: ${totalItems}\n\n`;
  emailBody += '--- ORDER DETAILS ---\n\n';
  
  selectedItems.forEach(category => {
    emailBody += `${category.categoryTitle}:\n`;
    category.items.forEach(item => {
      emailBody += `  • ${item}\n`;
    });
    emailBody += '\n';
  });
  
  emailBody += '--- END ORDER ---\n\n';
  emailBody += 'Please confirm availability and provide pricing information.\n';
  emailBody += 'Thank you!';
  
  return emailBody;
};

// Format order for printing
export const formatOrderForPrint = (title: string, menuData: MenuCategory[]): string => {
  const selectedItems = getSelectedItems(menuData);
  const totalItems = getTotalSelectedItems(menuData);
  
  let printContent = `<div class="print-order">`;
  printContent += `<h1>${title}</h1>`;
  printContent += `<p>Order Date: ${new Date().toLocaleDateString()}</p>`;
  printContent += `<p>Total Items: ${totalItems}</p>`;
  printContent += `<hr>`;
  
  selectedItems.forEach(category => {
    printContent += `<div class="category">`;
    printContent += `<h3>${category.categoryTitle}</h3>`;
    printContent += `<ul>`;
    category.items.forEach(item => {
      printContent += `<li>${item}</li>`;
    });
    printContent += `</ul>`;
    printContent += `</div>`;
  });
  
  printContent += `</div>`;
  return printContent;
};