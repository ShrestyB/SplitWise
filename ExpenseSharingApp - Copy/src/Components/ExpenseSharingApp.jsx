import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const ExpenseSharingApp = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState('');

  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant)) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (participantToRemove) => {
    setParticipants(participants.filter(p => p !== participantToRemove));
  };

  const addExpense = () => {
    if (description && amount && paidBy && participants.length > 0) {
      const splitAmount = parseFloat(amount) / participants.length;
      const newExpense = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        paidBy,
        splitAmount,
        participants: [...participants]
      };
      setExpenses([...expenses, newExpense]);
      setDescription('');
      setAmount('');
      setPaidBy('');
    }
  };

  const removeExpense = (expenseId) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };

  const calculateBalances = () => {
    const balances = {};
    participants.forEach(participant => {
      balances[participant] = 0;
    });

    expenses.forEach(expense => {
      balances[expense.paidBy] += expense.amount;
      expense.participants.forEach(participant => {
        balances[participant] -= expense.splitAmount;
      });
    });

    return balances;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Expense Sharing App</h1>
        
        {/* Add Participants Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Add Participants</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              placeholder="Enter participant name"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addParticipant}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {participants.map(participant => (
              <span
                key={participant}
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {participant}
                <button
                  onClick={() => removeParticipant(participant)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Add Expense Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Add Expense</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 border rounded"
            />
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Paid by</option>
              {participants.map(participant => (
                <option key={participant} value={participant}>
                  {participant}
                </option>
              ))}
            </select>
            <button
              onClick={addExpense}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* Expenses List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Expenses</h3>
          <div className="space-y-2">
            {expenses.map(expense => (
              <div
                key={expense.id}
                className="bg-gray-50 p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-gray-600">
                    Paid by {expense.paidBy} • Rs{expense.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Split: Rs{expense.splitAmount.toFixed(2)} each
                  </p>
                </div>
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Balances */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Balances</h3>
          <div className="space-y-2">
            {Object.entries(calculateBalances()).map(([participant, balance]) => (
              <div
                key={participant}
                className="flex justify-between items-center bg-gray-50 p-3 rounded"
              >
                <span>{participant}</span>
                <span className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                  Rs{balance.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSharingApp;