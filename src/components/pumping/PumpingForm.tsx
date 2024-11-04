import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth";

interface PumpingFormData {
  sessionType: 'regular' | 'power';
  volume: string;
  duration: string;
  notes: string;
}

export function PumpingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<PumpingFormData>({
    defaultValues: {
      sessionType: 'regular',
      volume: '',
      duration: '',
      notes: '',
    },
  });

  const onSubmit = async (data: PumpingFormData) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('pumping_sessions')
        .insert({
          user_id: user.id,
          session_type: data.sessionType,
          start_time: new Date().toISOString(),
          duration_minutes: parseInt(data.duration),
          volume_ml: parseFloat(data.volume),
          notes: data.notes || null,
        });

      if (error) throw error;

      form.reset();
      queryClient.invalidateQueries({ queryKey: ['pumping-sessions'] });
    } catch (error) {
      console.error('Error submitting pumping session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <FormField
            control={form.control}
            name="sessionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">Session Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 md:h-11">
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="regular">Regular Session</SelectItem>
                    <SelectItem value="power">Power Session</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <FormField
              control={form.control}
              name="volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Volume (ml)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter volume"
                      className="h-10 md:h-11"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Duration (min)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter time"
                      className="h-10 md:h-11"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any notes..."
                    className="resize-none min-h-[80px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-10 md:h-11 text-sm md:text-base" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Session'}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
