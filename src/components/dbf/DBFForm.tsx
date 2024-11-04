import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { supabase } from '@/lib/supabase';
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from '@/lib/auth';

interface DBFFormData {
  breastUsed: 'left' | 'right' | 'both';
  notes: string;
}

interface DBFFormProps {
  startTime: string | null;
  endTime: string | null;
  onComplete: () => void;
}

export function DBFForm({ startTime, endTime, onComplete }: DBFFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<DBFFormData>({
    defaultValues: {
      breastUsed: 'left',
      notes: '',
    },
  });

  const onSubmit = async (data: DBFFormData) => {
    if (!user || !startTime) {
      console.error('User not authenticated or no start time');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('dbf_sessions')
        .insert({
          user_id: user.id,
          breast_used: data.breastUsed,
          start_time: startTime,
          end_time: endTime,
          notes: data.notes || null,
        });

      if (error) throw error;

      // Reset form and refresh data
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['dbf-sessions'] });
      onComplete();
    } catch (error) {
      console.error('Error submitting DBF session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="breastUsed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breast Used</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select breast used" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any notes@."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !startTime || !endTime}
          >
            {isSubmitting ? 'Saving@.' : 'Save Session'}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
