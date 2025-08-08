'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function QuotationForm() {
  const router = useRouter();
  const [refNo, setRefNo] = useState('');
  const [useItems, setUseItems] = useState(true); // New state to toggle items section
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    address: '',
    through: '',
    subject: '',
    description: '',
    items: [
      { qty: '', description: '', unitPrice: '', total: '' },
    ],
    totalPrice: '',
    vat: '',
    grandTotal: '',
    date: '',
  });

  // Auto-generate reference number based on current year+month
  useEffect(() => {
    const generateRefNo = async () => {
      const now = new Date();
      const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

      const qRef = query(
        collection(db, 'quotations'),
        where('refNo', '>=', `${yyyymm}-000`),
        where('refNo', '<', `${yyyymm}-999`)
      );
      const snapshot = await getDocs(qRef);
      const count = snapshot.size + 1;

      const newRefNo = `${yyyymm}-${String(count).padStart(3, '0')}`;
      setRefNo(newRefNo);

      const dateString = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
      setFormData((prev) => ({
        ...prev,
        date: dateString,
      }));
    };

    generateRefNo();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  interface QuotationItem {
  qty: string;
  description: string;
  unitPrice: string;
  total: string;
}

interface FormData {
  // ... your other form fields
  items: QuotationItem[];
  totalPrice: string;
  vat: string;
  grandTotal: string;
}

const handleItemChange = (index: number, field: keyof QuotationItem, value: string) => {
  // Validate index range
  if (index < 0 || index >= formData.items.length) {
    console.error('Invalid item index');
    return;
  }

  // Create a deep copy of items array and update the specific field
  const updatedItems = formData.items.map((item, i) => {
    if (i !== index) return item;
    
    const updatedItem = { ...item, [field]: value };
    
    // Auto-calculate total if qty or unitPrice changes
    if (field === 'qty' || field === 'unitPrice') {
      const qty = parseFloat(updatedItem.qty) || 0;
      const unitPrice = parseFloat(updatedItem.unitPrice) || 0;
      updatedItem.total = (qty * unitPrice).toFixed(2);
    }
    
    return updatedItem;
  });

  // Calculate totals with proper error handling
  const totalPrice = updatedItems.reduce((sum, item) => {
    const itemTotal = parseFloat(item.total) || 0;
    return sum + itemTotal;
  }, 0);

  const vat = parseFloat((totalPrice * 0.12).toFixed(2));
  const grandTotal = parseFloat((totalPrice + vat).toFixed(2));

  // Update form state
  setFormData(prev => ({
    ...prev,
    items: updatedItems,
    totalPrice: totalPrice.toFixed(2),
    vat: vat.toFixed(2),
    grandTotal: grandTotal.toFixed(2)
  }));
};

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { qty: '', description: '', unitPrice: '', total: '' }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    
    const totalPrice = newItems.reduce((sum, item) => sum + parseFloat(item.total || '0'), 0);
    const vat = totalPrice * 0.12;
    const grandTotal = totalPrice + vat;

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      totalPrice: totalPrice.toFixed(2),
      vat: vat.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    }));
  };

  const handleTotalChange = (e: any) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    if (name === 'totalPrice') {
      const vat = numValue * 0.12;
      const grandTotal = numValue + vat;
      setFormData((prev) => ({
        ...prev,
        totalPrice: value,
        vat: vat.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
      }));
    } else if (name === 'vat') {
      const totalPrice = parseFloat(formData.totalPrice) || 0;
      const grandTotal = totalPrice + numValue;
      setFormData((prev) => ({
        ...prev,
        vat: value,
        grandTotal: grandTotal.toFixed(2),
      }));
    } else if (name === 'grandTotal') {
      const totalPrice = parseFloat(formData.totalPrice) || 0;
      const vat = numValue - totalPrice;
      setFormData((prev) => ({
        ...prev,
        vat: vat.toFixed(2),
        grandTotal: value,
      }));
    }
  };

  const toggleItemsSection = () => {
    setUseItems(!useItems);
    if (!useItems) {
      // When enabling items section, reset totals based on items
      const totalPrice = formData.items.reduce((sum, item) => sum + parseFloat(item.total || '0'), 0);
      const vat = totalPrice * 0.12;
      const grandTotal = totalPrice + vat;
      
      setFormData(prev => ({
        ...prev,
        totalPrice: totalPrice.toFixed(2),
        vat: vat.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      refNo,
      createdAt: Timestamp.now(),
      // If not using items, send empty array
      items: useItems ? formData.items : [],
    };
    
    await addDoc(collection(db, 'quotations'), submissionData);
    alert('Quotation saved!');
    router.push('/quotation-list');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow">
      <h1 className="text-2xl font-bold mb-4">Create Quotation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Reference No.</label>
            <input
              type="text"
              value={refNo}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Through</label>
            <input
              type="text"
              name="through"
              value={formData.through}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    rows={4}
    placeholder="Enter detailed description..."
  />
</div>
        </div>

        {/* Toggle for items section */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useItems"
            checked={useItems}
            onChange={toggleItemsSection}
            className="mr-2"
          />
          <label htmlFor="useItems">Include Items Section</label>
        </div>

        {/* Item Table - only shown if useItems is true */}
        {useItems && (
          <div>
            <h2 className="font-semibold">Items</h2>
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Qty"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Total"
                  value={item.total}
                  readOnly
                  className="border px-2 py-1 rounded bg-gray-100"
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
            >
              ➕ Add Item
            </button>
          </div>
        )}

        {/* Totals - now editable when items section is disabled */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>Total Price</label>
            <input
              type="text"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleTotalChange}
              readOnly={useItems}
              className={`w-full border px-2 py-1 rounded ${useItems ? 'bg-gray-100' : ''}`}
            />
          </div>
          <div>
            <label>VAT (12%)</label>
            <input
              type="text"
              name="vat"
              value={formData.vat}
              onChange={handleTotalChange}
              readOnly={useItems}
              className={`w-full border px-2 py-1 rounded ${useItems ? 'bg-gray-100' : ''}`}
            />
          </div>
          <div>
            <label>Grand Total</label>
            <input
              type="text"
              name="grandTotal"
              value={formData.grandTotal}
              onChange={handleTotalChange}
              readOnly={useItems}
              className={`w-full border px-2 py-1 rounded font-bold ${useItems ? 'bg-gray-100' : ''}`}
            />
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            💾 Submit Quotation
          </button>
        </div>
      </form>
    </div>
  );
}