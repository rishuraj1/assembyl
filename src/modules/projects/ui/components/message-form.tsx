import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutosize from "react-textarea-autosize";
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

interface Props {
    projectId: string
}

const formSchema = z.object({
    value: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt cannot exceed 10000 characters'),
})

export const MessageForm = ({ projectId }: Props) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    // const isWindows = typeof window !== 'undefined' && window.navigator.platform.startsWith('Win');
    // const isMac = typeof window !== 'undefined' && window.navigator.platform.startsWith('Mac');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: ""
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
            // TODO: Invalidate usage status
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
            projectId
        })
    }

    const [isFocused, setIsFocused] = useState(false);
    const isPending = createMessage.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid
    const showUsage = false;

    console.log("isBUttonDisabled:", isButtonDisabled);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    "relative border p-4 rounded-xl pt-1 bg-sidebar dark:bg-sidebar transition-all",
                    isFocused && "shadow-xs",
                    showUsage && "rounded-t-none"
                )}
            >
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