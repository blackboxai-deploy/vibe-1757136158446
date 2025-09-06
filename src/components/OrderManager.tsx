'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  getSavedOrders,
  deleteSavedOrder,
  saveOrder,
  saveDraft,
  loadDraft,
  clearDraft,
  type SavedOrder,
} from '@/lib/orderUtils';
import { MenuCategory } from '@/lib/menuData';

interface OrderManagerProps {
  currentTitle: string;
  menuData: MenuCategory[];
  onLoadOrder: (title: string, menuData: MenuCategory[]) => void;
  onSaveSuccess: () => void;
}

export const OrderManager: React.FC<OrderManagerProps> = ({
  currentTitle,
  menuData,
  onLoadOrder,
  onSaveSuccess,
}) => {
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([]);
  const [saveTitle, setSaveTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  // Load saved orders on component mount
  useEffect(() => {
    loadSavedOrders();
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTitle && menuData) {
        saveDraft(currentTitle, menuData);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentTitle, menuData]);

  const loadSavedOrders = () => {
    try {
      setSavedOrders(getSavedOrders());
    } catch (error) {
      showMessage('error', 'Failed to load saved orders');
    }
  };

  const handleSaveOrder = async () => {
    if (!saveTitle.trim()) {
      showMessage('error', 'Please enter a title for the order');
      return;
    }

    setLoading(true);
    try {
      saveOrder(saveTitle, menuData);
      loadSavedOrders();
      clearDraft();
      showMessage('success', 'Order saved successfully!');
      setShowSaveDialog(false);
      onSaveSuccess();
    } catch (error) {
      showMessage('error', 'Failed to save order');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadOrder = (order: SavedOrder) => {
    onLoadOrder(order.title, order.menuData);
    setShowLoadDialog(false);
    showMessage('success', `Loaded order: ${order.title}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    try {
      deleteSavedOrder(orderId);
      loadSavedOrders();
      showMessage('success', 'Order deleted successfully');
    } catch (error) {
      showMessage('error', 'Failed to delete order');
    }
  };

  const handleLoadDraft = () => {
    const draft = loadDraft();
    if (draft) {
      onLoadOrder(draft.title, draft.menuData);
      showMessage('success', 'Draft loaded successfully');
    } else {
      showMessage('error', 'No draft found');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const getTotalSelectedItems = (order: SavedOrder): number => {
    return order.menuData.reduce((total, category) => {
      return total + category.items.filter(item => item.selected).length;
    }, 0);
  };

  return (
    <div className="space-y-4">
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-2">
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button variant="default">
              Save Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Current Order</DialogTitle>
              <DialogDescription>
                Enter a title for this order to save it for later use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter order title..."
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveOrder()}
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveOrder} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Order'}
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              Load Order ({savedOrders.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Load Saved Order</DialogTitle>
              <DialogDescription>
                Select an order to load. This will replace your current selections.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {savedOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No saved orders found.
                </p>
              ) : (
                savedOrders.map((order) => (
                  <Card key={order.id} className="cursor-pointer hover:bg-muted/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-base">{order.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {getTotalSelectedItems(order)} items
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleLoadOrder(order)}
                          >
                            Load
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="secondary" onClick={handleLoadDraft}>
          Load Draft
        </Button>
      </div>
    </div>
  );
};