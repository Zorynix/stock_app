import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TrackedInstrumentResponse } from '@/types/api';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (buyPrice: number, sellPrice: number) => void;
  instrumentName: string;
  figi: string;
  currentPrice?: number;
  editData?: TrackedInstrumentResponse | null;
  isLoading?: boolean;
}

export function AlertDialog({
  open,
  onClose,
  onSubmit,
  instrumentName,
  currentPrice,
  editData,
  isLoading,
}: AlertDialogProps) {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) {
      setBuyPrice(String(editData.buyPrice));
      setSellPrice(String(editData.sellPrice));
    } else if (currentPrice) {
      setBuyPrice(String((currentPrice * 0.95).toFixed(2)));
      setSellPrice(String((currentPrice * 1.05).toFixed(2)));
    } else {
      setBuyPrice('');
      setSellPrice('');
    }
    setError('');
  }, [editData, currentPrice, open]);

  const handleSubmit = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);

    if (isNaN(buy) || isNaN(sell)) {
      setError('Введите корректные числа');
      return;
    }
    if (buy <= 0 || sell <= 0) {
      setError('Цены должны быть больше нуля');
      return;
    }
    if (buy >= sell) {
      setError('Цена покупки должна быть меньше цены продажи');
      return;
    }

    onSubmit(buy, sell);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? 'Редактировать алерт' : 'Создать алерт'}</DialogTitle>
          <p className="text-sm text-primary font-medium mt-1">
            {instrumentName}
            {currentPrice != null && (
              <span className="text-positive ml-2">• {currentPrice.toFixed(2)} ₽</span>
            )}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="buy-price">Цена покупки (уведомить, когда цена упадёт ниже)</Label>
            <Input
              id="buy-price"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="0.00"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sell-price">Цена продажи (уведомить, когда цена поднимется выше)</Label>
            <Input
              id="sell-price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {error && <p className="text-sm text-negative">{error}</p>}

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" className="flex-1" onClick={onClose}>
              Отмена
            </Button>
            <Button className="flex-1" onClick={handleSubmit} loading={isLoading}>
              {editData ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
