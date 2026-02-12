'use client'
import { useFormStatus } from 'react-dom'
import { Sparkles, Loader2 } from 'lucide-react'

const SubmitButton = () => {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type='submit' 
      disabled={pending} 
      className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl 
        ${pending 
          ? "bg-white/10 text-muted-foreground cursor-wait" 
          : "bg-primary text-black hover:scale-[1.01] hover:shadow-primary/25 active:scale-[0.98] cursor-pointer"
        }`}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          AI is forging your course...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Generate Learning Path
        </>
      )}
    </button>
  )
}

export default SubmitButton;