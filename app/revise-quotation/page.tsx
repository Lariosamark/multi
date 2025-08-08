'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, FileText, User, MapPin, Calendar, Hash, Calculator, FileEdit, CheckCircle } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/firebaseConfig';
type Item = {
  qty: string;
  description: string;
  unitPrice: string;
  total: string;
};

export default function RevisionPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerPosition, setCustomerPosition] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [date, setDate] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState('');
  const [vat, setVat] = useState('');
  const [grandTotal, setGrandTotal] = useState('');
  const [notes, setNotes] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [approvedBy, setApprovedBy] = useState('');

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

      const newRefNo = `R-${yyyymm}-${String(count).padStart(3, '0')}`;
      setRefNumber(newRefNo);

      const dateString = now.toLocaleDateString('en-CA'); // YYYY-MM-DD 
      setDate(dateString);
    };

    generateRefNo();
  }, []);
  const handleAddItem = () => {
    setItems([...items, { qty: '', description: '', unitPrice: '', total: '' }]);
  };

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    
    // Auto-calculate total if qty and unitPrice are provided
    if (field === 'qty' || field === 'unitPrice') {
      const qty = field === 'qty' ? parseFloat(value) || 0 : parseFloat(updatedItems[index].qty) || 0;
      const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].total = (qty * unitPrice).toFixed(2);
    }
    
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const vatAmount = subtotal * 0.12; // Assuming 12% VAT
    const grand = subtotal + vatAmount;
    
    setTotal(subtotal.toFixed(2));
    setVat(vatAmount.toFixed(2));
    setGrandTotal(grand.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    try {
      console.log('Saving revision...', {
        customerName,
        customerPosition,
        customerAddress,
        date,
        refNumber,
        items,
        total,
        vat,
        grandTotal,
        notes,
        preparedBy,
        approvedBy,
      });
      
      alert('Revision saved successfully!');
    } catch (error) {
      console.error('Error saving revision:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FileEdit className="w-8 h-8 text-blue-600" />
                  Quotation Revision
                </h1>
                <p className="text-gray-600 mt-2">Create and modify quotation details</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Document Type</div>
                <div className="font-semibold text-gray-900">REVISION FORM</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Customer Information
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position/Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={customerPosition}
                    onChange={(e) => setCustomerPosition(e.target.value)}
                    placeholder="Enter position or title"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Document Details
              </h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Reference Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    placeholder="QR-2024-001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Items & Services
                </h2>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
            </div>
            <div className="p-8">
              {items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">No items added yet</p>
                  <p>Click "Add Item" to start building your quotation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-700">
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2">Unit Price</div>
                    <div className="col-span-2">Total</div>
                    <div className="col-span-1">Action</div>
                  </div>
                  
                  {/* Items */}
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="md:col-span-2">
                        <label className="block md:hidden text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          placeholder="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label className="block md:hidden text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          placeholder="Item description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block md:hidden text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block md:hidden text-sm font-medium text-gray-700 mb-1">Total</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                          value={item.total}
                          onChange={(e) => handleItemChange(index, 'total', e.target.value)}
                          readOnly
                        />
                      </div>
                      <div className="md:col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="w-full md:w-auto p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Calculate Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={calculateTotals}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Calculator className="w-4 h-4" />
                      Calculate Totals
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Totals Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Financial Summary</h2>
            </div>
            <div className="p-8">
              <div className="max-w-md ml-auto space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Subtotal:</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-32 px-3 py-2 text-right border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">VAT (12%):</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-32 px-3 py-2 text-right border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <label className="text-lg font-semibold text-gray-900">Grand Total:</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-32 px-3 py-2 text-right text-lg font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                    value={grandTotal}
                    onChange={(e) => setGrandTotal(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Approval */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes & Comments
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes, terms, or special instructions..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prepared By
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    placeholder="Name and position"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approved By
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={approvedBy}
                    onChange={(e) => setApprovedBy(e.target.value)}
                    placeholder="Name and position"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              Save Revision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}