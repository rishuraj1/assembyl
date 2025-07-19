import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon, Loader2Icon, Paperclip } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutosize from "react-textarea-autosize";
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { PROJECT_TEMPLATES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FormControl, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
    value: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt cannot exceed 10000 characters'),
    model: z.string().min(1, 'Model is required'),
    apiKey: z.string().min(1, 'API key is required'),
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
            model: "openai-gpt-4", // default model
            apiKey: ""
        }
    });

    const createProject = useMutation(trpc.projects.create.mutationOptions({
        onSuccess: (data) => {
            form.reset();
            queryClient.invalidateQueries(
                trpc.projects.getMany.queryOptions()
            )
            router.push(`/projects/${data.id}`);
        },
        onError: (error) => {
            toast.error(error.message);
            router.push('/sign-in');
        }
    }))

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Submitting message:", values);
        await createProject.mutateAsync({
            value: values.value,
            model: values.model,
            apiKey: values.apiKey
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
    const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
    const attachmentRef = useRef<HTMLDivElement>(null);
    // Timer for delayed hide
    const hideTimer = useRef<NodeJS.Timeout | null>(null);

    // Handlers to show/hide with delay
    const handlePopoverEnter = () => {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setShowAttachmentOptions(true);
    };
    const handlePopoverLeave = () => {
        hideTimer.current = setTimeout(() => setShowAttachmentOptions(false), 120);
    };
    const isPending = createProject.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid

    console.log("isBUttonDisabled:", isButtonDisabled);

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
                            <div className='gap-x-2 flex items-center'>
                                <div
                                    className='relative'
                                    ref={attachmentRef}
                                    onMouseEnter={handlePopoverEnter}
                                    onMouseLeave={handlePopoverLeave}
                                    tabIndex={-1}
                                >
                                    {/* Popover with two buttons above, horizontal and animated */}
                                    {showAttachmentOptions && (
                                        <div
                                            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-row gap-2 z-10"
                                            style={{
                                                animation: 'slideUpFadeIn 0.25s cubic-bezier(0.4,0,0.2,1)',
                                            }}
                                        >
                                            <Button size="icon" className="size-8 bg-white dark:bg-zinc-800 shadow border border-zinc-200 dark:border-zinc-700 transition-transform hover:scale-110">
                                                <span role="img" aria-label="Image">🖼️</span>
                                            </Button>
                                            <Button size="icon" className="size-8 bg-white dark:bg-zinc-800 shadow border border-zinc-200 dark:border-zinc-700 transition-transform hover:scale-110">
                                                <span role="img" aria-label="File">📄</span>
                                            </Button>
                                        </div>
                                    )}
                                    {/* <Button
                                        className={"size-8 bg-transparent text-zinc-500 hover:bg-transparent hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"}
                                        tabIndex={0}
                                        type="button"
                                    >
                                        <Paperclip className='h-4 w-4' />
                                    </Button> */}
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
                        </div>
                    </form>
                    <div className='flex-wrap justify-center gap-2 hidden md:flex max-w-3xl'>
                        {PROJECT_TEMPLATES.map((template) => (
                            <Button
                                key={template.title}
                                variant={"outline"}
                                size="sm"
                                className='bg-white cursor-pointer dark:bg-sidebar text-muted-foreground hover:bg-muted-foreground hover:text-white transition-colors'
                                onClick={() => onSelect(template.prompt)}
                                disabled={isPending}
                            >
                                {template.emoji} {template.title}
                            </Button>
                        ))}
                    </div>
                </section>
            </Form>
        </>
    )
}