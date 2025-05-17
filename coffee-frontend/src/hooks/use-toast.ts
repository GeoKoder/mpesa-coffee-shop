import { useToast as useToastOriginal } from "@/components/ui/use-toast"

export const useToast = () => {
  const { toast } = useToastOriginal()

  return {
    toast: ({
      title,
      description,
      duration = 5000,
      variant = "default",
    }: {
      title: string
      description?: string
      duration?: number
      variant?: "default" | "destructive"
    }) => {
      toast({
        title,
        description,
        duration,
        variant,
      })
    },
  }
}
