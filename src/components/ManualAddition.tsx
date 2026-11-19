import React, { useState } from 'react';
import { PlusCircle, AlertCircle, HeartHandshake, Loader2 } from 'lucide-react';

interface ManualAdditionProps {
  isSubmitting: boolean;
  onAddManual: (amount: number) => Promise<boolean>;
}

export const ManualAddition: React.FC<ManualAdditionProps> = ({
  isSubmitting,
  onAddManual,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['-', '+', '.', 'e', 'E', ','].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmed = inputValue.trim();

    if (!trimmed) {
      setValidationError('Please enter how many times you proposed.');
      return;
    }

    if (!/^\d+$/.test(trimmed)) {
      setValidationError('Only positive whole numbers are allowed (no decimals or symbols).');
      return;
    }

    const parsed = parseInt(trimmed, 10);

    if (isNaN(parsed) || parsed <= 0) {
      setValidationError('Please enter a number greater than 0.');
      return;
    }

    const success = await onAddManual(parsed);
    if (success) {
      setInputValue('');
    }
  };

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto mt-6 bg-gradient-to-b from-amber-50/80 via-emerald-50/50 to-stone-50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-dashed border-emerald-300/80 shadow-md shadow-emerald-950/5 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <HeartHandshake className="w-5 h-5 text-emerald-700 shrink-0" />
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-emerald-950">
          Were there proposals we missed? 👀
        </h2>
      </div>

      <p className="text-slate-600 text-sm mb-5 leading-relaxed">
        Add the ones that happened when you weren't here to click!
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              placeholder="Enter number of times..."
              data-testid="manual-count-input"
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-emerald-200 focus:border-amber-500 focus:ring-3 focus:ring-amber-200 text-slate-800 placeholder:text-emerald-400/60 font-sans text-base transition-all outline-hidden shadow-xs disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !inputValue.trim()}
            data-testid="manual-add-button"
            className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:scale-95 text-white font-medium text-base rounded-2xl shadow-md shadow-amber-600/20 hover:shadow-amber-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Add to our count ❤️</span>
              </>
            )}
          </button>
        </div>

        {validationError && (
          <div
            data-testid="manual-input-error"
            className="flex items-center gap-2 text-red-700 text-xs sm:text-sm font-medium bg-red-50 p-2.5 rounded-xl border border-red-200"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}
      </form>
    </section>
  );
};
