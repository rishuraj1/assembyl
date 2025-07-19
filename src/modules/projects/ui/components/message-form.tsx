import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutosize from "react-textarea-autosize";
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

interface Props {
    projectId: string
}

const formSchema = z.object({
    value: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt cannot exceed 10000 characters'),
    model: z.string().min(1, 'Model is required'),
    apiKey: z.string().min(1, 'API key is required'),
})

export const MessageForm = ({ projectId }: Props) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
            model: "openai-gpt-4", // default model
            apiKey: ""
        }
    });

    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess: (data) => {
            form.reset();
            queryClient.invalidateQueries(
                trpc.messages.getMany.queryOptions({
                    projectId
                })
            )
        },
        onError: (error) => {
            // TODO: redirect to pricing page if specific error
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again.");
        }
    }))

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Submitting message:", values);
        await createMessage.mutateAsync({
            value: values.value,
            projectId,
            model: values.model,
            apiKey: values.apiKey
        })
    }

    const [isFocused, setIsFocused] = useState(false);
    const isPending = createMessage.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    "relative border p-4 rounded-xl pt-1 bg-sidebar dark:bg-sidebar transition-all",
                    isFocused && "shadow-xs",
                )}
            >
                {/* Model selection */}
                <FormField
                    control={form.control}
                    name='model'
                    render={({ field }) => (
                        <div className="mb-2">
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="openai-gpt-4">OpenAI GPT-4</SelectItem>
                                        <SelectItem value="claude-3">Claude 3</SelectItem>
                                        <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />
                {/* API Key input */}
                <FormField
                    control={form.control}
                    name='apiKey'
                    render={({ field }) => (
                        <div className="mb-2">
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" placeholder="Enter your API key" autoComplete="off" />
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />
                {/* Existing textarea and submit button */}
                <FormField
                    control={form.control}
                    name='value'
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            disabled={isPending}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            minRows={2}
                            maxRows={8}
                            className='pt-4 resize-none border-none w-full outline-none bg-transparent'
                            placeholder='What would you like to build today?'
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)(e);
                                }
                            }}
                        />
                    )}
                />
                <div className='flex gap-x-2 items-end justify-between pt-2'>
                    <div className='text-[10px] text-muted-foreground font-mono'>
                        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
                            <span>&#8984;</span> Enter
                        </kbd>
                        &nbsp;to submit
                    </div>
                    <Button
                        disabled={isButtonDisabled}
                        className={cn(
                            "size-8 rounded-full",
                            isButtonDisabled && "cursor-not-allowed bg-muted-foreground border"
                        )}
                    >
                        {isPending ? <Loader2Icon className='size-4 animate-spin' /> : <ArrowUpIcon className='h-4 w-4' />}
                    </Button>
                </div>
            </form>
        </Form>
    )
}