import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import { Hint } from "./hint";
import { Button } from "./ui/button";
import { CodeView } from "./code-view";
import { toast } from "sonner";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "./ui/resizable";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "./ui/breadcrumb"
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./tree-view";

type FileCollection = { [path: string]: string };

interface FileExplorerProps {
    files: FileCollection
}

function getLanguageFromExtension(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension || "text"
}

interface FileBreadcrumbProps {
    filePath: string;
}

const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
    const pathSegments = filePath.split('/')
    const maxSegments = 4;
    const renderBreadcrumbItems = () => {
        if (pathSegments.length <= maxSegments) {
            // show all segments if 4 or less
            return (
                pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;
                    return (
                        <Fragment key={index}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-medium">
                                        {segment}
                                    </BreadcrumbPage>
                                ) : (
                                    <span className="text-muted-foreground">
                                        {segment}
                                    </span>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </Fragment>
                    )
                })
            )
        } else {
            const firstSegment = pathSegments[0];
            const lastSegment = pathSegments[pathSegments.length - 1];
            return (
                <>
                    <BreadcrumbItem>
                        <span className="text-muted-foreground">
                            {firstSegment}
                        </span>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbEllipsis />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">
                                {lastSegment}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbItem>
                </>
            )
        }
    }

    return (
        <Breadcrumb className="flex-1">
            <BreadcrumbList className="flex items-center gap-x-2">
                {renderBreadcrumbItems()}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files);
        return fileKeys.length > 0 ? fileKeys[0] : null;
    });
    const [isCopying, setIsCopying] = useState(false);

    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files);
    }, [files])

    const handleFileSelect = useCallback((
        filePath: string
    ) => {
        if (files[filePath]) {
            setSelectedFile(filePath);
        }
    }, [files])

    const handleCopyToClipboard = useCallback(() => {
        if (selectedFile && files[selectedFile]) {
            setIsCopying(true);
            navigator.clipboard.writeText(files[selectedFile])
                .then(() => {
                    console.log("Copied to clipboard:", files[selectedFile]);
                })
                .catch(err => {
                    console.error("Failed to copy:", err);
                });
                toast.success("File content copied to clipboard", {
                    description: "You can now paste it anywhere.",
                    duration: 2000,
                });
        }
        setTimeout(() => {
            setIsCopying(false);
        }, 2000); // Reset after 2 seconds
    }, [selectedFile, files]);

    return (
        <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
                <TreeView
                    data={treeData}
                    value={selectedFile}
                    onSelect={handleFileSelect}
                />
            </ResizablePanel>
            <ResizableHandle className="hover:bg-primary transition-colors" />
            <ResizablePanel defaultSize={70} minSize={50} className="bg-sidebar">
                {selectedFile && files[selectedFile] ? (
                    <div className="h-full flex w-full flex-col">
                        <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                            <FileBreadcrumb filePath={selectedFile} />
                            <Hint text="Copy to clipboard" side="bottom">
                                <Button
                                    className="ml-auto cursor-pointer"
                                    variant={"outline"}
                                    size={"icon"}
                                    onClick={handleCopyToClipboard}
                                    disabled={isCopying}
                                >
                                    {isCopying ? (
                                        <CopyCheckIcon className="w-4 h-4" />
                                    ) : (
                                        <CopyIcon className="w-4 h-4" />
                                    )}
                                </Button>
                            </Hint>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            <CodeView
                                code={files[selectedFile]}
                                language={getLanguageFromExtension(selectedFile)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        Select a file to view it&apos;s content
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}