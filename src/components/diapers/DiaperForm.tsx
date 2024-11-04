import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

interface DiaperFormData {
  changeType: 'wet' | 'soiled' | 'both';
  notes: string;
}

export function DiaperForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<DiaperFormData>({
    defaultValues: {
      changeType: 'wet',
      notes: '',
    },
  });

  const onSubmit = async (data: DiaperFormData) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('diaper_changes')
        .insert({
          user_id: user.id,
          type: data.changeType,
          change_time: new Date().toISOString(),
          notes: data.notes || null,
        });

      if (error) throw error;

      // Reset form and refresh data
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['diaper-changes'] });
    } catch (error) {
      console.error('Error submitting diaper change:', error);
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
            name="changeType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select change type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="wet">Wet</SelectItem>
                    <SelectItem value="soiled">Soiled</SelectItem>
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
                    placeholder="Add any notes or concerns..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Record Change'}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
