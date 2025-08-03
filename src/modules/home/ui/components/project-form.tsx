import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { ArrowUpIcon, Loader2Icon, Paperclip } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutosize from "react-textarea-autosize";
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { RANDOM_PROMPT } from '@/types';

const formSchema = z.object({
    value: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt cannot exceed 10000 characters'),
})

// Add animation styles
const attachmentPopoverAnimation = `
@keyframes slideUpFadeIn {
  0% { opacity: 0; transform: translateY(20px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
`;

export const ProjectForm = () => {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        }
    });

    const { data: randomPrompts, refetch, isRefetching } = useQuery({
        ...trpc.home.getPrompts.queryOptions(),
        enabled: true
    })
    const createProject = useMutation(trpc.projects.create.mutationOptions({
        onSuccess: (data) => {
            form.reset();
            queryClient.invalidateQueries(
                trpc.projects.getMany.queryOptions()
            )
            queryClient.invalidateQueries(
                trpc.usage.status.queryOptions()
            )
            router.push(`/projects/${data.id}`);
        },
        onError: (error) => {
            toast.error(error.message);
            if (error.data?.code === "UNAUTHORIZED") {
                router.push('/sign-in');
            }
            if (error.data?.code === "TOO_MANY_REQUESTS") {
                router.push('/pricing');
            }
        }
    }))

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createProject.mutateAsync({
            value: values.value,
        })
    }

    const onSelect = (content: string) => {
        form.setValue('value', content, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });
    }

    const [isFocused, setIsFocused] = useState(false);

    const attachmentRef = useRef<HTMLDivElement>(null);
    const isPending = createProject.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid

    return (
        <>
            <style>{attachmentPopoverAnimation}</style>
            <Form {...form}>
                <section className='space-y-6'>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={cn(
                            "relative border p-4 rounded-xl pt-1 bg-sidebar dark:bg-sidebar transition-all",
                            isFocused && "shadow-xs",
                        )}
                    >
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
                            <div className='gap-x-2 flex items-center'>
                                {/* <Button
                                    className={"size-8 bg-transparent text-zinc-500 hover:bg-transparent hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"}
                                    type="button"
                                >
                                    <Paperclip className='h-4 w-4' />
                                </Button> */}
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
                        </div>
                    </form>
                    <div className='relative flex-wrap justify-center gap-6 hidden md:flex max-w-3xl'>
                        {randomPrompts && randomPrompts.length > 0 && !isRefetching ? (
                            randomPrompts.map((template: RANDOM_PROMPT, idx) => (
                                <Button
                                    key={template.title}
                                    variant={"outline"}
                                    size="sm"
                                    className={cn(
                                        'floating-btn bg-white cursor-pointer dark:bg-sidebar text-muted-foreground hover:bg-muted-foreground hover:text-white transition-colors',
                                        `delay-${(idx % 2) * 100}`
                                    )}
                                    onClick={() => onSelect(template.prompt)}
                                    disabled={isPending}
                                    style={{
                                        animationDelay: `${(idx % 5) * 0.4}s`,
                                    }}
                                >
                                    {template.emoji} {template.title}
                                </Button>
                            ))
                        ) : (
                            <Loader2Icon className='h-6 w-6 animate-spin text-muted-foreground' />
                        )}
                    </div>
                </section>
            </Form>
        </>
    )
}