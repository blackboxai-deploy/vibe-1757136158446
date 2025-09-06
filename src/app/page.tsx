'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderManager } from '@/components/OrderManager';
import { ContactActions } from '@/components/ContactActions';
import { PrintOrder } from '@/components/PrintOrder';
import { initialMenuData, type MenuCategory } from '@/lib/menuData';
import { getTotalSelectedItems, saveDraft } from '@/lib/orderUtils';

export default function BanquetMenuOrderForm() {
  const [formTitle, setFormTitle] = useState('Banquet Menu Order Form');
  const [menuData, setMenuData] = useState<MenuCategory[]>(initialMenuData);
  const [totalSelected, setTotalSelected] = useState(0);

  // Update total selected items whenever menu data changes
  useEffect(() => {
    setTotalSelected(getTotalSelectedItems(menuData));
  }, [menuData]);

  // Auto-save draft every time data changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(formTitle, menuData);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formTitle, menuData]);

  const handleItemToggle = (categoryId: string, itemId: string) => {
    setMenuData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? { ...item, selected: !item.selected }
                  : item
              ),
            }
          : category
      )
    );
  };

  const handleItemNameChange = (categoryId: string, itemId: string, newName: string) => {
    setMenuData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? { ...item, name: newName }
                  : item
              ),
            }
          : category
      )
    );
  };

  const handleLoadOrder = (title: string, loadedMenuData: MenuCategory[]) => {
    setFormTitle(title);
    setMenuData(loadedMenuData);
  };

  const handleClearAll = () => {
    setMenuData(prevData =>
      prevData.map(category => ({
        ...category,
        items: category.items.map(item => ({ ...item, selected: false })),
      }))
    );
  };

  const handleSelectAllInCategory = (categoryId: string) => {
    setMenuData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item => ({ ...item, selected: true })),
            }
          : category
      )
    );
  };

  const getCategorySelectedCount = (category: MenuCategory): number => {
    return category.items.filter(item => item.selected).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-2xl font-bold h-12 text-center border-2 border-primary/20 focus:border-primary"
            placeholder="Enter form title..."
          />
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className="text-base px-3 py-1">
              {totalSelected} items selected
            </Badge>
            {totalSelected > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                Clear All Selections
              </Button>
            )}
          </div>
        </div>

        {/* Order Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderManager
              currentTitle={formTitle}
              menuData={menuData}
              onLoadOrder={handleLoadOrder}
              onSaveSuccess={() => {}}
            />
          </CardContent>
        </Card>

        {/* Menu Categories */}
        <div className="space-y-6 mb-8">
          {menuData.map((category) => {
            const selectedCount = getCategorySelectedCount(category);
            
            return (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {category.title}
                        {category.subtitle && (
                          <span className="text-base font-normal text-muted-foreground ml-2">
                            {category.subtitle}
                          </span>
                        )}
                      </CardTitle>
                      {selectedCount > 0 && (
                        <Badge variant="secondary" className="mt-2">
                          {selectedCount} of {category.items.length} selected
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAllInCategory(category.id)}
                    >
                      Select All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-all"
                      >
                        <Checkbox
                          id={item.id}
                          checked={item.selected}
                          onCheckedChange={() =>
                            handleItemToggle(category.id, item.id)
                          }
                          className="scale-125"
                        />
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            handleItemNameChange(category.id, item.id, e.target.value)
                          }
                          className="flex-1 border-none bg-transparent focus:bg-background focus:border-border shadow-none"
                          placeholder="Enter menu item..."
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator className="my-8" />

        {/* Print Order Summary */}
        <PrintOrder title={formTitle} menuData={menuData} />

        <Separator className="my-8" />

        {/* Contact Actions */}
        <ContactActions title={formTitle} menuData={menuData} />

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            This form automatically saves your progress as you work. Use the order management
            tools to save multiple versions and load previous orders.
          </p>
          <p className="mt-2">
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}